const nodemailer = require("nodemailer");
const sendgridTransport = require('nodemailer-sendgrid-transport');
//Send Email function for verifying an email
const sendVerifyEmail = async (email, link) => {
    // create reusable transporter object using the default SMTP transport
    // let transporter = nodemailer.createTransport({
    //     service: "gmail",
    //     auth: {
    //         user: "fitsumayalew69.gmail.com",
    //         pass: "player4notever",
    //     },
    // });



    let transporter = nodemailer.createTransport(sendgridTransport({
        auth: {
            api_key: "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"
        }
    }))
    // transporter.sendMail({
    //     to: this.toEmail,
    //     from: process.env.SMTP_SENDER_EMAIL,
    //     subject: this.subject,
    //     html: this.html
    // })



    var mailOptions = {
        from: '"Xcut" <ethiohemo@ethiohemophiliayouth.com>', // sender address
        to: email, // list of receivers
        subject: "Xcut verify email", // Subject line
        html:
            `<b>Xcut Verify Email</b>
            <p>Open this link to verify your email: ` +
            link +
            "</p>", // html body
    };

    let info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);

};




module.exports = sendVerifyEmail;