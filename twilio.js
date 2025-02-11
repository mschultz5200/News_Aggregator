

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
