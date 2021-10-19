const express = require("express");
const { urlencoded, json } = require("body-parser");
const path = require("path");
const { request } = require("./request");
const app = express();
const cors = require("cors");

var mailchimpInstance = "us1",
  listUniqueId = "0582b30931",
  mailchimpApiKey = "e88e9aa6351b728c9d0f9e2e95ae598a-us1";
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(json());
app.use(urlencoded({ extended: true }));
//Static folder
app.use(express.static(path.join(__dirname, "public")));

// Join Waitlist Route
app.post("/waitlist", async (req, res) => {
  try {
    const response = await request(
      `https://${mailchimpInstance}.api.mailchimp.com/3.0/lists/${listUniqueId}/members`,
      "POST",
      {
        email_address: req.body.email,
        status: "subscribed",
        merge_fields: {
          FNAME: req.body.firstName,
          LNAME: req.body.lastName,
        },
      },
      {
        Authorization:
          "Basic " + new Buffer("any:" + mailchimpApiKey).toString("base64"),
      }
    );

    if (response.status != 200) {
      throw JSON.stringify(response.body);
    }

    return res
      .status(200)
      .json({ error: false, message: "SignUp Successfully!" });
  } catch (e) {
    return res.status(400).json({ error: true, message: e.toString() });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on ${PORT}`));
