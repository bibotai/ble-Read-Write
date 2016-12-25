var noble = require('noble');

export const startScan noble.on('stateChange', function (state) {
    if (state === 'poweredOn') {
        console.log('poweredOn');
        noble.startScanning();
    } else {
        console.log('poweredOff');
        noble.stopScanning();

    }
});