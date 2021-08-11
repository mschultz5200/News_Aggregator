var fs = require('fs');
var Papa = require('papaparse');
const tw = require('./twilio');
const EventEmitter = require('events');
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'matthewschultz',
    host: 'localhost',
    database: 'api',
    password: 'Hpto3200',
    port: 5432,
});

const validateNumber = number => {
  let foundNumber = false;
  pool.query('SELECT phone_number FROM users ORDER BY id ASC', (err, results) => {
    if (err) {
      console.log(err)
    }
    let found = false;
    let i = 0;
    while (i < results.rowCount && found === false) {
      const item = Object.values(results.rows[i]);
      temp = item[0];
      if (temp === number) {
        foundNumber = true;
        found = true;
      }
    }
  })
}

// parses the fox news csv file and then sets it in a format that can be sent to the user
const foxArray = () => {
  let arr = undefined;
  var file = '/Users/matthewschultz/webapplications/foxnews.csv';
  var content = fs.readFileSync(file, "utf8");
  Papa.parse(content, {
    delimiter: ',',
    linebreak: '\n',
    complete: function(results) {  
      arr = Object.values(results.data);
    }
  });
  return arr;
}

// parses the vox news csv file and then sets it in a format that can be sent to the user
const voxArray = () => {
  let arr = undefined;
  var file = '/Users/matthewschultz/webapplications/voxHome.csv';
  var content = fs.readFileSync(file, "utf8");
  Papa.parse(content, {
    delimiter: ',',
    linebreak: '\n',
    complete: function(results) {  
      arr = Object.values(results.data);
    }
  });
  return arr;
}

// parses the new york times csv file and then sets it in a format that can be sent to the user
const nytArray = () => {
  let arr = undefined;
  var file = '/Users/matthewschultz/webapplications/nytHome.csv';
  var content = fs.readFileSync(file, "utf8");
  Papa.parse(content, {
    delimiter: ',',
    linebreak: '\n',
    complete: function(results) {  
      arr = Object.values(results.data);
    }
  });
  return arr;
}

// function that randomly selects a news article to send to the user
const selectArticle = () => {
  let choice = Math.floor(Math.random() * 3);
  let selectedArray = undefined;
  if (choice === 0) {
    selectedArray = foxArray();
  } else if (choice === 1) {
    selectedArray = voxArray();
  } else {
    selectedArray = nytArray();
  }
  let tempID = Math.floor(Math.random() * selectedArray.length)
  let i = 0;
  let found = false;
  while (i < selectedArray.length && found === false) {
    if (selectedArray[i][0] == tempID) {
      selectedArray = selectedArray[i];
      found = true;
    }
    i++;
  }
  return selectedArray
}

// this will send the morning text to each user in the database
const morningTxt = () => {
  pool.query('SELECT first_name, phone_number FROM users ORDER BY id ASC', (err, results) => {
    if (err) {
      console.log(err)
    }
    for (i = 0; i < results.rowCount; i++) {
      const item = Object.values(results.rows[i]);
      const name  = item[0];
      const number = item[1];
      const arr = selectArticle();
      const headline = arr[1];
      const link = arr[2];
      const text = `Good Morning ${name}. Here is an article we think you would like: ${headline}. We've also included the link: ${link}`;
      tw.sendInMorning(text, number);
    }
  })
  
}

const getUsers = (req, res) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (err, results) => {
      if (err) {
        throw err
      }
      res.status(200).json(results.rows)
    })
  }

const getUserById = (req, res) => {
    const id = parseInt(req.params.id)
  
    pool.query('SELECT * FROM users WHERE id = $1', [id], (err, results) => {
      if (err) {
        throw err
      }
      res.status(200).json(results.rows)
    })
}

// function that adds users into the posgres database
const createUser = (req, res) => {
  const first_name = req.body.first_name_field
  const last_name = req.body.last_name_field
  const email = req.body.email_field
  const phone_number = req.body.phone_field
  pool.query('INSERT INTO users (first_name, last_name, email, phone_number) VALUES ($1, $2, $3, $4)', [first_name, last_name, email, phone_number], (err, results) => {
    if (err) {
      res.send("There was an error adding you to the database. Please refresh the page and try again.");
    }
    res.send("Successfully added");
  })
}

module.exports = {
  morningTxt,
  createUser,
  selectArticle,
}