//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/public'));


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});


app.post("/", function(req, res) {

  let firstName = req.body.FName;
  let lastName = req.body.LName;
  let email = req.body.Email;


  const options = {
    host: 'us7.api.mailchimp.com',
    path: '/3.0/lists/'+process.env.LIST_ID,
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Shadib '+ process.env.API_KEY
    }
  };

  const request = https.request(options, (response) => {
    console.log(`statusCode : ${response.statusCode}`);

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

  });

  const requestData = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  request.write(JSON.stringify(requestData));

  request.end();

  request.on('error', (err) => {
    if (err) {
      res.sendFile(__dirname + "/failure.html");
    }
  });

});


app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(3000, function(req, res) {
  console.log("Server is running on port: 3000");
});
