const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
var app = express();
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
const port = 3001;

let myData = [];
myData.concat("Hello World");

app.get('/', (req, res) => {
    return res.send(myData.slice(-150));
})

app.post('/', (req, res) => {
    var payload = req.body;
    myData = myData.concat(payload);
    res.send("all good");

})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}.`);
})