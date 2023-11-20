const crypto = require('crypto');
const nodemailer = require('nodemailer');

const generateVerificationToken = () => {
    return crypto.randomBytes(20).toString('hex');
};


const VerifyEmail = expressAsyncHandler(async (req, res) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password',
        },
    });

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Account Verification',
        html: `<p>Click the following link to verify your account: <a href="http://your-app-domain/verify/${verificationToken}">Verify</a></p>`,
    };

    await transporter.sendMail(mailOptions);
})



module.exports = { VerifyEmail }




