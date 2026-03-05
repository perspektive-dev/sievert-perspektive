const nodemailer = require('nodemailer');

// Create a transporter object
let transporter = nodemailer.createTransport({
  service: 'gmail', // you can use other services like Outlook, Yahoo, etc.
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
});

const sendMailNotifReferral = async (data) => {
    try {
        const html = `<html>
            <head></head>
            <body>
                <p>
                   Hi Sievert, there is a new email [${data.email}] in the ${data.referral_type} category. 
                   Check full email list in the Google Sheets input [${data.fullLink}].
                </p>
            </body>
            </html>`
        const mailTos = (process.env.EMAIL_TARGET || "").split(",")
        for (let index = 0; index < mailTos.length; index++) {
            const to = mailTos[index];
            if (to == "") {
                continue;
            }
            await transporter.sendMail({
                from : process.env.MAIL_USER,
                to : to,
                subject : "Referral Notifications",
                html: html,
            })
        }
        
    } catch (error) {
        console.log();
    }
}

module.exports = { sendMailNotifReferral };