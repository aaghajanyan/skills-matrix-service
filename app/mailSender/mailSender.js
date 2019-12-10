const nodemailer = require("nodemailer");
const adminData = require(__dirname + "/../../config/nodeMailer").nodeMailer;

class MailSender {
    static async sendEmail(host, token, email) {
        const username = Buffer.from(adminData.username, 'base64').toString('ascii');
        const password = Buffer.from(adminData.password, 'base64').toString('ascii');
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: username,
              pass: password
            }
          });

        const info = await transporter.sendMail({
            from: username,
            to: 'albert93aghajanyan@mail.ru', // todo change it to email (recived from parameters)
            subject: 'Skill Matrix',
            html: `<h3> The url is active 7 days.</h3><br>
                    <h3>Please register your account for the link bellow:</h3><br>
                    <a href='http://'+${host}+?token=${token}>${host}?token=${token}</a>`
        });
        console.log('Message sent: ', info.messageId);
        console.log('Preview URL: ', nodemailer.getTestMessageUrl(info));
    }  
}

  module.exports = MailSender;