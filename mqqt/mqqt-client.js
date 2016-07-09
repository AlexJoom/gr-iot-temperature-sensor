var ttn = require('ttn');
var path = require("path");
//read connection data from .env file
require('dotenv').config({path: __dirname + path.sep +'.env' });
var mongoose = require("mongoose");
const Measurement= require('../models/Measurement');


mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', () => {
    console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});

var client = new ttn.Client(process.env.TTN_MQTT_URL,
                            process.env.TTN_APP_EUI,
                            process.env.TTN_APP_ACCESS_KEY);

client.on('uplink', function (data) {


    var buffer = new Buffer(data.fields.raw,'base64');
    var temperature = parseFloat(buffer.toString());
    var measurement = new Measurement({device: data.devEUI,
                             data: temperature,
                            time : data.metadata.gateway_time
                            });
    measurement.save(function(err){
       if (err) //todo:log errors
           console.log(err);

    });

});

client.on('activation', function (evt) {
  //  console.log('Device activated:', msg.devEUI);
});

client.on('error', function (err) {
    // todo: handle error
});


