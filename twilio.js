const accountSid = 'AC4bdee1093f7725677c49bd5da0c66e3e'; 
const authToken = 'c834c69025bbb197a1ab7d84c75152e4'; 

const twilio = require('twilio');
const client = new twilio(accountSid, authToken);

// this sends the morning text all the users from the number
const sendInMorning = (text, number) => {
  client.messages
  .create({
    body: `${text}`,
    to: `+1${number}`,
    from: '+12135169380',
  })
  .then((message) => console.log(message.sid))
  .catch(e => console.error(e.stack));
}

module.exports = {
  hello,
  sendInMorning
}