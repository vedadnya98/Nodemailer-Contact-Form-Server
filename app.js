const express = require('express');
const bodyParser = require('body-parser');
// const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

const dotenv = require('dotenv');
dotenv.config();

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.get('/', (req, res) => {
  res.send("Node Mailer is running")
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.post('/send', (req, res) => {

  // setup email data with unicode symbols
  let mailOptions = {
      from:process.env.EMAIL,
      to: process.env.TO, // list of receivers
      subject: req.body.subject, // Subject line
      text: req.body.message, // plain text body
      html: 'Message from: ' + req.body.name + '<br></br> Email: ' +  req.body.email + '<br></br> Message: ' + req.body.message // html body
  };

 // create reusable transporter object using the default SMTP transport
 let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port:465,
  secure:true,
  // secure: false, // true for 465, false for other ports
  auth: {
  type: 'oauth2',
  user: process.env.EMAIL, // generated ethereal user
  pass: process.env.PASSWORD,  // generated ethereal password
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN,
},
tls:{
rejectUnauthorized:false
}
});
  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.send('Email has been sent');
  });
  });



app.listen(process.env.PORT||4000, () => console.log('Server started...'));