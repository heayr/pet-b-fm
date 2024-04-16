// import type { NextApiRequest, NextApiResponse } from "next";
// // import FormData from "form-data";
// // import  Mailgun  from 'mailgun.js';

// // const API-KEY = process.env.

// const formData = require('form-data');
// const Mailgun = require('mailgun.js');
// const mailgun = new Mailgun(formData);
// const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY || ''});

// mg.messages.create('sandbox-123.mailgun.org', {
// 	from: "Contact Form <mailgun@sandbox-123.mailgun.org>",
// 	to: ["wolandmunt@gmail.com"],
// 	subject: "New Contact Form",
// 	text: "Testing some Mailgun awesomeness!",
// 	html: "<h1>Testing some Mailgun awesomeness!</h1>"
// })
// .then(msg => console.log(msg)) // logs response data
// .catch(err => console.log(err)); // logs any error



// type ResponseData = {
//   message: string;
// };

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<ResponseData>
// ) {
//   console.log("Data", req.body);

//   res.status(200).json({ message: "типа отправил" });
// }

// !..............................................................................................


// import FormData from 'form-data'
// import Mailgun from 'mailgun.js'
// import type { NextApiRequest, NextApiResponse } from 'next'

// const API_KEY = process.env.MAILGUN_API_KEY || ''
// const DOMAIN = process.env.MAILGUN_DOMAIN || ''

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   console.log('Data', req.body)

//   const mailgun = new Mailgun(FormData)
//   const client = mailgun.client({ username: 'api', key: API_KEY })

//   const { name, email, message } = req.body

//   const messageData = {
//     from: 'Contact Form <wolandmunt@gmail.com>',
//     to: 'wolandmunt@gmail.com',
//     subject: 'New Contact Form!',
//     text: `Hello,

//     You have a new form entry from: ${name} ${email}.

//     ${message}
//     `,
//   }

//   try {
//     const emailRes = await client.messages.create(DOMAIN, messageData)
//     console.log(emailRes)
//   } catch (err: any) {
//     console.error('Error sending email', err)
//   }

//   res.status(200).json({ submitted: true })
// }

