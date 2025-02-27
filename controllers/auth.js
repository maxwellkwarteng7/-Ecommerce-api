const { StatusCodes } = require("http-status-codes");
const wrapper = require("express-async-handler");
const { User, oneTimePin } = require("../models");
const jwt = require("jsonwebtoken");
const { ValidationError } = require("sequelize");
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
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'email , username and  password are required fields' });
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
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'email and password fields are required' });
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: 'No user with this credentials found' });
  }
  const isMatch =
    user && (await user.validatePassword(password, user.password));
  if (!isMatch) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid or wrong password'});
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
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid or no token provided' });
  }
  const token = authorization.split(" ")[1];

  const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (!verifiedToken || !verifiedToken.exp) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid Token' });
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
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'email field is required' }); 
  }
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: 'No user with email found'});
  }
  emailService(user, "Reset Password Pin", "reset your password");
  res.status(StatusCodes.OK).json({ message: "Reset Password pin sent" });
});

//change or reset password
const sendOneTimePin = wrapper(async (req, res) => {
  const { pin, email, password, type } = req.body;
  if (!pin || !email || !type) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'pin , email  and type are required fields' });
  }
  if (type === "forgot_password") {
    if (!password) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Password field is required' });
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
    return res.status(StatusCodes.NOT_FOUND).json({ error: 'No user with email found'});
  }
  const currentTime = new Date();

  if (
    !user.forgotPasswordPin.pin === pin ||
    user.forgotPasswordPin.expiresIn < currentTime
  ) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid or expired pin'});
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
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Email and type are required fields '});
  }
  const user = await User.findOne({
    where: { email },
  });
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
