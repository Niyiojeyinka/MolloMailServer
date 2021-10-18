const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
var request = require('superagent');

const app = express();
const regex = /\w+\s\w+(?=\s)|\w+/g;

var mailchimpInstance = 'us1',
    listUniqueId = '0582b30931',
    mailchimpApiKey = 'e88e9aa6351b728c9d0f9e2e95ae598a-us1';

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))


//Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Join Waitlist Route
app.post('/waitlist', (req, res) => {

    request
        .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
        .set('Content-Type', 'application/json;charset=utf-8')
        .set('Authorization', 'Basic ' + new Buffer('any:' + mailchimpApiKey).toString('base64'))
        .send({
            'email_address': req.body.email,
            'status': 'subscribed',
            'merge_fields': {
                'FNAME': req.body.firstName,
                'LNAME': req.body.lastName
            }
        })
        .end(function (err, response) {
            if (response.statusCode == 400) {
                res.send({"error": true, "message":"Member Exist!"});
            }else if(response.statusCode == 200){
                res.send({"error": false, "message":"SignUp Successfully!"});
            }
        });
})



const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on ${PORT}`));