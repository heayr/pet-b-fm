// import { NextApiRequest, NextApiResponse } from 'next';
// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   host: 'smtp.example.com',
//   port: 587,
//   auth: {
//     user: 'your_email@example.com',
//     pass: 'your_password'
//   }
// });

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { name, email, message } = req.body;

//   const mailOptions = {
//     from: 'your_email@example.com',
//     to: 'recipient_email@example.com',
//     subject: 'Message from ' + name,
//     html: `
//       <p>Name: ${name}</p>
//       <p>Email: ${email}</p>
//       <p>Message: ${message}</p>
//     `
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.status(200).json({ message: 'Email sent successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to send email' });
//   }
// }