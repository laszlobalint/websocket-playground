const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/perfData', { useNewUrlParser: true, useUnifiedTopology: true });
const Machine = require('./models/Machine');
const APP_KEYS = require('./models/constants');

function socketMain(io, socket) {
  socket.on('clientAuth', (key) => {
    if (key === APP_KEYS.CLIENT_APP_KEY) {
      socket.join('clients');
    } else if (key === APP_KEYS.UI_APP_KEY) {
      socket.join('ui');
      if (process.env.NODE_ENV === 'test') {
        Machine.find({}, (err, docs) => {
          docs.forEach((machine) => {
            machine.isActive = false;
            io.to('ui').emit('data', machine);
          });
        });
      }
    } else {
      socket.disconnect(true);
    }
  });

  socket.on('disconnect', () => {
    Machine.find({ macA }, (err, docs) => {
      docs[0].isActive = false;
      if (docs.length > 0) io.to('ui').emit('data', docs[0]);
    });
  });

  socket.on('initPerfData', async (data) => {
    macA = data.macA;
    const mongooseResponse = await validateAndInsert(data);
  });

  socket.on('perfData', (data) => {
    io.to('ui').emit('data', data);
  });
}

function validateAndInsert(data) {
  return new Promise((resolve, reject) => {
    Machine.findOne({ macA: data.macA }, (err, doc) => {
      if (err) {
        throw err;
        reject(err);
      } else if (doc === null) {
        const newMachine = new Machine(data);
        newMachine.save();
        resolve('Added new machine!');
      } else {
        resolve('Found a machine!');
      }
    });
  });
}

module.exports = socketMain;
