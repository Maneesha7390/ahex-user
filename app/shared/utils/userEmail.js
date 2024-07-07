const nodemailer = require('nodemailer');
const dotenv = require('dotenv')
const twilio = require('twilio')
// dotenv.config({path: `${__dirname}/../.env`});
dotenv.config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = (email, token) => {
  const verificationUrl = `http://localhost:${process.env.PORT}/auth/verify/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Account Verification',
    text: `Please verify your account by clicking the link: ${verificationUrl}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};



const userMail = process.env.EMAIL_USER;
const userPassword = process.env.EMAIL_PASS;
const accountSid = process.env.ACCOUNT_SID;
const accountAuthToken = process.env.AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_NUM;


const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPviaEmail = async (email, otp, firstName) => {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: userMail,
            pass: userPassword
        }
    });

    let info = await transporter.sendMail({
        from: userMail,
        to: email,
        subject: 'OTP for Email Verification',
        text: `Hi ${firstName},

Welcome to AHEX! We are excited to have you on board.

Please use the following OTP to verify your account:

OTP: ${otp}

If you have any questions or need further assistance, feel free to contact our support team.
Thank you,
AHEX Team`
    });

    console.log('Message sent: %s', info.messageId);
};

const sendOTPviaSms = async (phoneNumber, otp, firstName) =>{
    const client = new twilio(accountSid, accountAuthToken);
    const message = await client.messages.create({
        body: `Hi ${firstName},\n\nYour OTP for account verification is ${otp}.\n\nThank you,\nAHEX`,
        from: twilioPhoneNumber,
        to: `+91${phoneNumber}`
    });

}

const sendLoginFailedMail = async(firstName, email)=>{
  const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Unsuccessful Login Attempt',
      text: `Dear ${firstName},\n\nWe have detected an unsuccessful attempt to log in to your account. If this was not you, please secure your account immediately.\n\nBest regards,\nAHEX Technologies`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h1 style="color: #333;">Unsuccessful Login Attempt</h1>
          <p>Dear ${firstName},</p>
          <p>We have detected an unsuccessful attempt to log in to your account. If this was not you, please secure your account immediately.</p>
          <p>Best regards,<br>AHEX Technologies</p>
        </div>
      `,
  };
   transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Success email sent: ' + info.response);
  });
}

const sendLoginEmail = async(firstName, toEmail) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Login Successful',
    text: `Dear ${firstName},\n\nWe are pleased to inform you that you have successfully logged into your account.\n\nBest regards,\nAHEX Technologies`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h1 style="color: #333;">Login Successful</h1>
        <p>Dear ${firstName},</p>
        <p>We are pleased to inform you that you have successfully logged into your account.</p>
        <p>Best regards,<br>AHEX Technologies</p>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
      return;
    }
    console.log('Success email sent: ' + info.response);
  });
};

module.exports = { 
  sendVerificationEmail,
  generateOtp,
  sendOTPviaEmail,
  sendOTPviaSms,
  sendLoginFailedMail,
  sendLoginEmail
 };
