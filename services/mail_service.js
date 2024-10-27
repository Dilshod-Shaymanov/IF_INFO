const nodemailer = require("nodemailer");
const config = require("config");

class MailService {
  constructor() {
    this.trasporter = nodemailer.createTransport({
      service: "gmail",
      host: config.get("smpt_host"),
      port: config.get("smpt_port"),
      secure: false,
      auth: {
        user: config.get("smpt_user"),
        pass: config.get("smpt_password"),
      },
    });
  }
  async sendActivationMail(toEmail, link) {
    await this.trasporter.sendMail({
      from: config.get("smpt_user"),
      to: toEmail,
      subject: "ITINFO accountini faollashtirish",
      text: "",
      html: `
        <div>
            <h1>Accountni faollashtirish uchun quyidagi linkni bosing</h1>
            <a href="${link}">FAOLLASHTIRING</a>
        </div>
        `,
    });
  }
}

module.exports = new MailService();
