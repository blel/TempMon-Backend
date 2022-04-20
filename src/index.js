const express = require('express');
const cors = require ('cors');
var app = express();
app.use(cors({origin: '*'}));
const port = 3001;

let someValues = [20.1, 23.3, 11.2];

let myData =[{"Label": "14.30", "Value":12}, {"Label": "14.45", "Value":13}];
console.log(JSON.stringify(myData));

const test = '[{"label":"14.00","value":12}, {"label":"14.30","value":13}]';
let newTest = JSON.parse(test);
console.log(newTest);

app.get('/', (req, res) => {
    return res.send(myData);
})

app.post('/', (req, res)=>{
    var payload = req.body;
    console.log(payload);
       myData = myData.concat(payload);
    res.send("all good");

})

app.get('/test', (req, res) => {
    return res.send('{Hello World!}');
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}.`);
})