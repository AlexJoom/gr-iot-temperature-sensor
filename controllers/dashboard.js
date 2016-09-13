const Measurement= require('../models/Measurement');

exports.getDashboard = (req, res) => {

    Measurement
        .distinct('device')
        .exec(function(err,data){
            console.log(data);
            res.render('dashboard', {
                title: 'Dashboard',
                menuItem: "dashboard",
                measurements: [],
                devices :data
            });
        });
};

exports.getMeasurementsForDevice = (req,res) => {

    var today = new Date();
    today.setHours(-48, 0, 0, 0);

    Measurement
        .find({
            "createdAt" : { $gt: today },
            "device" : req.params.deviceId
        })
        .sort({createdAt:-1})
        .exec(function(err,data){
            res.json(data);
        });

}