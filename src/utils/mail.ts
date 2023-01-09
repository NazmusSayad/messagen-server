import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export default ({ to, subject, body }) => {
  return transporter
    .sendMail({
      to,
      subject,
      from: `Messagen <${process.env.EMAIL}>`,
      html: body,
    })
    .catch(console.warn)
}
