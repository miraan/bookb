// @flow

import nodemailer from 'nodemailer';

export default class EmailClient {
  client: any

  constructor() {
    this.client = nodemailer.createTransport({
      host: 'in-v3.mailjet.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: '49b68c8715d28769a6262ebff5a9c06b',
        pass: 'd1dce9939b26c58c4d1aaaf8cb448a66',
      },
    });
  }

  sendInternalEmail = (subject: string, body: string) => Promise.all([
    'miraan.tabrez@gmail.com',
  ].map(to => this.sendEmail(to, subject, body)))

  sendEmail = (to: string, subject: string, body: string) => {
    const mailOptions = {
      from: 'noreply@bookb.co',
      to,
      subject,
      text: body,
    };

    console.log(`Sending email to: ${to}; subject: ${subject}; body: ${body}`);
    this.client.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });
  }
}
