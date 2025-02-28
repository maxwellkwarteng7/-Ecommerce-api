const { StatusCodes } = require("http-status-codes");
const wrapper = require("express-async-handler");
const { User, oneTimePin } = require("../models");
const jwt = require("jsonwebtoken");
const client = require("../service/redis");
const emailService = require("../service/emailService");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../errors");

const register = wrapper(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new BadRequestError("All fields are required");
  }
  const user = await User.create({ username, email, password });
  emailService(user, "Email Verification", "verify your email");
  res.status(StatusCodes.CREATED).json({
    message: "registration Successful and email verification pin sent",
  });
});

const login = wrapper(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("email and password fields are required");
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new NotFoundError(`No user with this credentials found`);
  }
  const isMatch =
    user && (await user.validatePassword(password, user.password));
  if (!isMatch) {
    throw new UnauthorizedError("Invalid or incorrect password");
  }
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
  res.status(StatusCodes.OK).json({
    message: {
      username: user.username,
      userRole: user.role,
      userEmail: user.email,
      token,
    },
  });
});

const logout = wrapper(async (req, res) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer")) {
    throw new BadRequestError("Invalid or no token provided");
  }
  const token = authorization.split(" ")[1];

  const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (!verifiedToken || !verifiedToken.exp) {
    throw new UnauthorizedError("Invalid Token");
  }

  // creating an expiration time
  const expiration = verifiedToken.exp - Math.floor(Date.now() / 1000);

  // blacklisting the token in the redis
  await client.set(`blacklisted:${token}`, "blacklisted", { EX: expiration });

  res.status(StatusCodes.OK).json({ message: "Logout Successful" });
});

// send 6 digit code
const initiateResetPassword = wrapper(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError('Email field is required'); 
  }
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new NotFoundError('No user with this email found'); 
  }
  emailService(user, "Reset Password Pin", "reset your password");
  res.status(StatusCodes.OK).json({ message: "Reset Password pin sent" });
});

//change or reset password
const sendOneTimePin = wrapper(async (req, res) => {
  const { pin, email, password, type } = req.body;
  if (!pin || !email || !type) {
    throw new BadRequestError('pin , email and type  fields are required'); 
  }
  if (type === "forgot_password") {
    if (!password) {
      throw new BadRequestError('Password field is required'); 
    }
  }
  // fetch the user
  const user = await User.findOne({
    where: { email },
    include: [
      {
        model: oneTimePin,
        as: "forgotPasswordPin",
      },
    ],
  });
  if (!user) {
    throw new BadRequestError('No user with this email found'); 
  }
  const currentTime = new Date();

  if (
    !user.forgotPasswordPin.pin === pin ||
    user.forgotPasswordPin.expiresIn < currentTime
  ) {
    throw new UnauthorizedError('invalid or expired pin'); 
  }
  if (type === "forgot_password") {
    user.password = password;
    user.save();
    return res
      .status(StatusCodes.OK)
      .json({ message: "password changed successfully" });
  }

  user.emailverification = currentTime;
  user.save();
  res.status(StatusCodes.OK).json({ message: "email verified successfully" });
});

const resendPin = wrapper(async (req, res) => {
  const { email, type } = req.body;
  if (!email || !type) {
    throw new BadRequestError('Email and type field required')
  }
  const user = await User.findOne({
    where: { email },
  });
  if (!user) {
    throw new NotFoundError('No user with this email found'); 
  }
  if (type === "email_verification") {
    emailService(user, "Email verification Pin", "verify your email ");
    return res
      .status(StatusCodes.OK)
      .json({ message: "Email verification Pin resent" });
  }
  emailService(user, "Password reset Pin", "reset your password");
  res.status(StatusCodes.OK).json({ message: "password reset pin  resent" });
});

module.exports = {
  register,
  login,
  logout,
  initiateResetPassword,
  sendOneTimePin,
  resendPin,
};
