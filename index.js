var noble = require('noble');
state = "poweredOn"
noble.on('stateChange', callback(state));

noble.startScanning(); // any service UUID, no duplicates