const Measurement= require('../models/Measurement');

exports.getDashboard = (req, res) => {
    Measurement
        .find({
            device:"0000000044FF92D2"
        })
        .limit(200)
        .sort({createdAt:-1})
        .exec(function(err,data){
            console.log(data);
            res.render('dashboard', {
                title: 'Dashboard',
                menuItem: "dashboard",
                measurements: data
            });
    });
};