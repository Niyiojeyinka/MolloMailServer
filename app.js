const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const regex = /\w+\s\w+(?=\s)|\w+/g;

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Signup Route
app.post('/signup', (req, res) => {
    const { firstName, email } = req.body;

    // Make sure fields are filled
    if (!firstName || !email) {
        res.redirect('/fail.html');
        return;
    }

    const [firstName1] = firstName.trim().match(regex);

    // Construct req data
    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName1,

                }
            }
        ]
    };

    const postData = JSON.stringify(data);

    fetch('https://us5.api.mailchimp.com/3.0/lists/1148113d21', {
        method: 'POST',
        headers: {
            Authorization: 'auth 307bf27f7429b230aeb0c4ad4a3b471e-us5'
        },
        body: postData
    })
        .then(res.statusCode === 200 ?
            res.redirect('/success') :
            res.redirect('/fail.html'))
        .catch(err => console.log(err))
})



const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on ${PORT}`));