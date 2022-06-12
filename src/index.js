const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");

const dataAccessLayer = require('./Modules/DataAccessLayer.js');


var app = express();
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
const port = 3001;

app.get('/', async (req, res) => {
    const results = await dataAccessLayer.getHistoricalData();
    return res.send(results);
})

app.get('/minmaxtoday/', async (req, res)=> {
    const results = await dataAccessLayer.getMinMaxToday();
    return res.send(results);
})

app.post('/', async (req, res) => {
    var payload = req.body;
    await dataAccessLayer.saveData(payload);
    res.send("all good");
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}.`);
})

function handleError(err) {
    console.log(err);
}




