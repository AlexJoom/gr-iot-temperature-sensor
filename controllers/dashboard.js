const Measurement= require('../models/Measurement');
const json2csv = require('json2csv');

//todo: move logic out of controllers, use promises
exports.getDashboard = (req, res) => {

    var resultsPromise = Measurement
        .distinct('device')
        .exec();

    resultsPromise.then(function(data){
        console.log(data);
        res.render('dashboard', {
            title: 'Dashboard',
            menuItem: "dashboard",
            measurements: [],
            devices :data
        });
    })
};

var getMeasurements = function(deviceid, hours){
    var today = new Date();
    today.setHours(-parseInt(hours), 0, 0, 0);

    return Measurement
        .find({
            "createdAt" : { $gt: today },
            "device" : deviceid
        })
        .sort({createdAt:-1})
        .exec();
}

exports.getMeasurementsForDevice = (req,res) => {
    getMeasurements(req.params.deviceId, req.params.hours)
        .then(function(data){
           res.json(data);
        });
}

exports.getFileWithMeasurementsInfo =(req,res) => {
    console.log("test");
    getMeasurements(req.params.deviceId)
        .then(function(data){

            var csvFields = [
                 {label: "Device", value:"device"},
                 {label: "Temperature", value:"data"},
                 {label: "Date and time", value:"createdAt"}
                ];
            var result = json2csv({ data: data, fields: csvFields} );
            res.setHeader('Content-disposition', 'attachment; filename=export.csv');
            res.set('Content-Type', 'text/csv');
            res.status(200).send(result);

        });

}