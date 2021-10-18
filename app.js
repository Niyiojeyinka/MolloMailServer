const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const regex = /\w+\s\w+(?=\s)|\w+/g;

// Bodyparser Middleware
app.use(bodyParser.urlencoded({ extended: true }));

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Join Waitlist Route
app.post('/waitlist', (req, res) => {
    const { fullName, email } = req.body;

    // Make sure fields are filled
    if (!fullName || !email) {
        res.redirect('/fail.html');
        return;
    }

    const [firstName, lastName] = fullName.trim().match(regex);

    // Construct req data
    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const postData = JSON.stringify(data);

    fetch('https://us1.api.mailchimp.com/3.0/lists/0582b30931', {
        method: 'POST',
        headers: {
            Authorization: 'auth e88e9aa6351b728c9d0f9e2e95ae598a-us1'
        },
        body: postData
    })
        .then(res.statusCode === 200 ?
            res.redirect('/index.html') :
            res.redirect('/index.html'))
        .catch(err => console.log(err))
})



const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on ${PORT}`));