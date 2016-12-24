var async = require('async');
var noble = require('noble');

var peripheralIdOrAddress = process
    .argv[2]
    .toLowerCase();

noble.on('stateChange', function (state) {
    if (state === 'poweredOn') {
        console.log('poweredOn');
        noble.startScanning();
    } else {
        console.log('poweredOn');
        noble.stopScanning();

    }
});

noble.on('discover', function (peripheral) {
    peripheral
        .connect(function (error) {
            console.log('connected to peripheral: ' + peripheral.uuid);
            peripheral.discoverServices(['636f6d2e6a6975616e2e414d56313200'], function (error, services) {
                var notifyService = services[0];
                console.log('discovered Notify service');
                console.log(notifyService);

                notifyService.discoverCharacteristics(['7365642e6a6975616e2e414d56313200'], function (error, characteristics) {
                    var notifyCharacteristic = characteristics[0];
                    var writeCharacteristic = characteristics[1];
                    console.log('discovered Notify and Write characteristic');

                    // true to enable notify
                    notifyCharacteristic.notify(true, function (error) {
                        console.log('notifyCharacteristic notification on');
                    });
                    writeCharacteristic.write(new Buffer([0xB0]), true, function (error) {
                        console.log('set writeCharacteristic to B0');
                    });
                    notifyCharacteristic.on('read', function (data, isNotification) {
                        console.log('notifyCharacteristic is now: ', data.readUInt8(0) + '%');
                    });

                });
            });
        });
});