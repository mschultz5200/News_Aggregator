// the imports used for the project
const http = require('http');
let express = require('express');
const EventEmitter = require('events');
const bodyParser = require('body-parser')
const db = require('./queries');
let app = express();
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const { error } = require('console');

// global constructor call to create an event
const morningText = new EventEmitter();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)


// function that calls the interface that scraps new sites and saves them as csv files
let automatedRefresh = () => {
    const spawn = require("child_process").spawn;
    const python = spawn('python', ['/Users/matthewschultz/webapplications/news_aggregators/interface.py']);
};

// event that checks the hour and then if the local time is 9 in the morning.
// If it is 9 then it will call automatedRefresh and the send out the morning text
morningText.on('send', () => {
  var d = new Date();
  let currentHour = d.getHours();
  console.log(currentHour)
  if (currentHour === 9) {
    automatedRefresh();
    db.morningTxt();
  }
})

// the main page the wbsite that will redict you to the sign up page
app.get('/', (req, res) => {
  res.redirect('/signup');
  if (error) {
    res.status(505).send('Something went wrong.')
  }
});

// directs the user to the sign up form
app.get('/signup', (req, res, next) => {
    res.sendFile('/Users/matthewschultz/webapplications/Files/form.html');
});

// sends the request to the server that will save a user to the postgres database
app.post('/signup', db.createUser);


// this checks and sends a response if the user the user ask for a new news article
app.post('/sms', (req,res) => {
  const twiml = new MessagingResponse();
  let recieved = req.body.Body.toLowerCase();
  if (recieved.includes('what\'s going on in the world')) {
    var arr = db.selectArticle();
    var headline = arr[1];
    var link = arr[2];
    const text = `We got what you're looking for chief! ${headline}. We also included the link to the article: ${link}`;
    twiml.message(text);
  } else {
    twiml.message('Please type: What\'s going on in the world!');
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

// this creates the the express server
http.createServer(app).listen(80, function (){
    setInterval(() => { morningText.emit('send') }, 3600000);
    console.log('Example app listening at http://localhost:80');
});
