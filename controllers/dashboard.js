const Measurement= require('../models/Measurement');

exports.getDashboard = (req, res) => {

    var today = new Date();
    today.setHours(0, 0, 0, 0);

    Measurement
        .find({
            "createdAt" : { $gt: today }
        })
        .sort({createdAt:-1})
      //  .limit(200)
        .exec(function(err,data){
            console.log(data);
            res.render('dashboard', {
                title: 'Dashboard',
                menuItem: "dashboard",
                measurements: data
            });
    });
};