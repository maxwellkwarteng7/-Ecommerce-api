const { PinGenerator, add5Minutes, html, mailSender } = require("../utils");
const { oneTimePin } = require('../models');


const emailService = async (user , subject , message) => {
    // generate one time passsword
    const pin = PinGenerator(); 
    // add minutes to current time
    const expiresIn = add5Minutes(5).toISOString();
    // destroy otp associated to user if any
    await oneTimePin.destroy({ where: { userId: user.id } });
    // create entry into onetimepassword table associated to this user
    await oneTimePin.create({
        userId: user.id,
        pin,
        expiresIn,
    });
    // send pin  to user email
     mailSender([user.email], subject, html(user.username, pin , message));
};

module.exports = emailService;