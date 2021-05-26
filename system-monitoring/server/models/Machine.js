const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Machine = new Schema({
  macA: String,
  freeMem: Number,
  totalMem: Number,
  usedMem: Number,
  memUsage: Number,
  osType: String,
  upTime: Number,
  cpuModel: String,
  numores: Number,
  cpuSpeed: Number,
  cpuLoad: Number,
});

module.exports = mongoose.model('Machine', Machine);
