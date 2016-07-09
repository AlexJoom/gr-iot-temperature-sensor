const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  device:{type:String},
  data: {type: Number},
  time: {type:Date}
}, { timestamps: true });

const Measurement = mongoose.model('Measurement', sensorDataSchema);

module.exports = Measurement;
