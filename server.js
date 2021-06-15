const express = require('express');
require('dotenv').config();
const nodemailer = require("nodemailer");

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// cors options
app.options('*', cors());
app.use(cors({
  origin: "*",
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  allowedHeaders: 'Content-Type,Authorization,Origin,X-Requested-with,Accept'
}));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`express app listening on port ${port}`);
});

//routes
app.get('/', (req, res) => {
  mailSend('victorysupper@gmail.com', 'test', 'this is test message');
  res.send("Welcome to node!")
})

app.post('/api/mailsend', (req, res) => {
  const { name, email, message } = req.body;
  mailSend(email, name, message);
  res.json('success');
});

async function mailSend(senderEmail, senderName, content) {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'mingchaitest27@gmail.com', // generated ethereal user
      pass: 'hFgAnvpTHGEL5zMC', // generated ethereal password
    },
    tls: {
      rejectUnauthorized: true
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"${senderName} 👻" <${senderEmail}>`, // sender address
    to: 'fullstack0103@gmail.com', // list of receivers
    subject: "Welcome ✔", // Subject line
    text: "Success", // plain text body
    html: `<b>email: ${senderEmail}</b>
    <b>name: ${senderName}</b>
    <b>content: ${content}</b>
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}