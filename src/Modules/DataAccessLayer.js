const mongoose = require("mongoose");
const dateFunctions = require('./Modules/DateFunctions.js');
const minimum = 'Minimum';
const maximum = 'Maximum';

var mongoDb = "mongodb://localhost";
mongoose.connect(mongoDb, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) console.log(err)
    else console.log("mongodb is connected");
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var Schema = mongoose.Schema;

var measurementsSchema = new Schema({
    MeasurementDateTime: Date,
    MeasurementType: String,
    MeasurementValue: Number
});

var minMaxSchema = new Schema({
    MeasurementDateTime: Date,
    MeasurementType: String,
    MeasurementValue: Number,
    Type: String
})


var measurementsModel = mongoose.model('measurementsModel', measurementsSchema);
var maxValuesModel = mongoose.model('maxValuesModel', minMaxSchema);

exports.getHistoricalData = async function() {
    const results = await measurementsModel.find().sort({ MeasurementDateTime: -1 }).limit(150).exec();
     return results;
} 

exports.getMinMaxToday = async function() {
    const results = await maxValuesModel.
    find().
    where('MeasurementDateTime').
    gte(dateFunctions.createTodayLowerBoundaryDate()).
    lte(dateFunctions.createTodayUpperBoundaryDate()).
    exec();
    return results;
}

exports.saveData = async function(payload){
    var measurementsInstance = new measurementsModel({
        MeasurementDateTime: payload.Item.MeasurementDateTime,
        MeasurementType: payload.Item.MeasurementType,
        MeasurementValue: payload.Item.MeasurementValue
    })
    measurementsInstance.save(function (err) {
        if (err) return handleError(err);
    })

    await saveMinMax(minimum, payload.Item.MeasurementType, payload.Item.MeasurementDateTime, payload.Item.MeasurementValue);
    await saveMinMax(maximum, payload.Item.MeasurementType, payload.Item.MeasurementDateTime, payload.Item.MeasurementValue);
}

async function saveMinMax(type, measurementType, measurementDateTime, measurementValue) {
    var result = await maxValuesModel.find().
        where('Type').equals(type).
        where('MeasurementType').equals(measurementType).
        where('MeasurementDateTime').
        gte(dateFunctions.createTodayLowerBoundaryDate()).
        lte(dateFunctions.createTodayUpperBoundaryDate()).
        exec();

    if (result.length==0) {
        var minInstance = new maxValuesModel({
            MeasurementDateTime: measurementDateTime,
            MeasurementType: measurementType,
            MeasurementValue: measurementValue,
            Type: type
        });
        minInstance.save(function (err) { if (err) return handleError(err) });
    } else if (
        (type == minimum && result[0].MeasurementValue > measurementValue) ||
        (type == maximum && result[0].MeasurementValue < measurementValue))
    {
        result[0].MeasurementValue = measurementValue;
        result[0].MeasurementDateTime = measurementDateTime;
        result[0].save();
    }

}