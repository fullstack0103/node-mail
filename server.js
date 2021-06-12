const express = require('express');
const Mailchimp = require('mailchimp-api-v3');
require('dotenv').config();
const nodemailer = require("nodemailer");

var mc_api_key = '8e1bd95e73187478406a34317456f62e-us1';
var list_id = 'e0feb09a65';

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mailchimp = new Mailchimp(mc_api_key);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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
  res.send("Welcome to Mailchimp!")
})

app.get('/api/memberList', (req, res) => {
  mailchimp.get(`/lists/${list_id}/members`)
  .then(function(results){
    main('forfatherland90717@outlook.com');
    res.json(results);
  })
  .catch(function(err){
    res.json(err);
  });
});

app.get("/api/memberAdd", (req, res) => {
  mailchimp.post(`/lists/${list_id}/members/`, {
    email_address: req.query.email,
    status: "subscribed"
  })
  .then(result => {
    main(req.query.email);
    res.json(result);
  })
  .catch(err => {
    res.json(err);
  })
})

async function main(target_email) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

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
    from: '"NEBULA 👻" <VictorySupper@gmail.com>', // sender address
    to: target_email, // list of receivers
    subject: "Welcome ✔", // Subject line
    text: "Success", // plain text body
    html: "<b>You have been subscribed successfully!</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}