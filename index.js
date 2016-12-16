var noble = require('noble');
state = "poweredOn"
noble.on('stateChange', function (state) {
    console.log(state);
});

noble.startScanning(); // any service UUID, no duplicates