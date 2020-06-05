const express = require('express');
const bodyParser = require('body-parser');
// const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

const dotenv = require('dotenv');
dotenv.config();

// // View engine setup
// app.engine('handlebars', exphbs());
// app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({extended:false}));
// app.use(express.multipart());


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
      // from: '"Venugopal Balaji" <venugopalportfolio@gmail.com>', // sender address
      // from:"venugopalportfolio@gmail.com",
      from:"vedadnya.portfolio@gmail.com",
      to: 'vedadnya@gmail.com', // list of receivers
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
      user: process.env.USER, // generated ethereal user
      pass: process.env.PASS,  // generated ethereal password
      clientId: process.env.client_id,
      clientSecret: process.env.client_secret,
      refreshToken: process.env.refreshToken,
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



app.listen(4000||process.env.PORT, () => console.log('Server started...'));