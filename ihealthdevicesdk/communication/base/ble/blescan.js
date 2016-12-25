var noble = require('noble');

function startScan() {
    noble
        .on('stateChange', function (state) {
            if (state === 'poweredOn') {
                console.log('poweredOn');
                noble.startScanning();
            } else {
                console.log('poweredOff');
                noble.stopScanning();

            }
        });
};

function stopScan() {
    noble.stopScanning();
}

export function scanDevice(macAddress) {
    const promise = new Promise(function (resolve, reject) {
        startScan();
        noble.on('discover', function (peripheral) {
            if (peripheral.id === macAddress || peripheral.address === macAddress) {
                stopScan();
                console.log(`device ${macAddress} is found.`);
                resolve(peripheral);
            } else {
                reject(new Error('not found'));
            }
        });
    });
    return promise;
}

export const promise = new Promise(function (resolve, reject) {
    startScan();
    noble.on('discover', function (peripheral) {
        if (peripheral.id === '00:4d:32:07:90:4b' || peripheral.address === '00:4d:32:07:90:4b') {
            stopScan();
            console.log(`device ${ '00:4d:32:07:90:4b'} is found.`);
            return resolve(peripheral);
        } else {
            //reject(new Error('not found'));
        }
    });
});