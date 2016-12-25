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
        console.log('poweredOff');
        noble.stopScanning();

    }
});

noble.on('discover', function (peripheral) {
    peripheral
        .connect(function (error) {
            // console.log('connected to peripheral: ' + peripheral.uuid);
            peripheral
                .discoverServices(['636f6d2e6a6975616e2e414d56313200'], function (error, services) {
                    // var service = services[0];
                    services
                        .map(function (service, index) {
                            console.log(`this is the ${index} service,uuid:${ '' + service.uuid} name:${service.name}`);
                            if (service.uuid == '636f6d2e6a6975616e2e414d56313200') {
                                service
                                    .discoverCharacteristics([], function (error, characteristics) {
                                        characteristics
                                            .map(function (characteristic, index) {
                                                console.log(`this is the ${index} characteristic,uuid:${ '' + characteristic.uuid}`);

                                            });
                                        // true to enable notify
                                        characteristics[0].notify(true, function (error) {
                                            console.log('characteristic notification on');
                                            characteristics[1].write(new Buffer([0xB0]), true, function (error) {
                                                console.log('characteristic write to B0');
                                                setTimeout(function () {
                                                    characteristics[1]
                                                        .write(new Buffer([
                                                            0xb0,
                                                            0x11,
                                                            0x11,
                                                            0x01,
                                                            0xaa,
                                                            0xfa,
                                                            0x51,
                                                            0x52,
                                                            0x03,
                                                            0x5e,
                                                            0x63,
                                                            0x49,
                                                            0x3d,
                                                            0x42,
                                                            0x68,
                                                            0x1e,
                                                            0x08,
                                                            0x45,
                                                            0x54,
                                                            0x0c
                                                        ]), true, function (error) {
                                                            console.log('characteristic write to B0111101AAFA5152035E63493d42681E0845540C');
                                                        });
                                                }, 1000)

                                            });
                                        });
                                        characteristics[0].on('read', function (data, isNotification) {
                                            var dataarr = [];
                                            for (var i = 0; i < data.length; i++) {
                                                var tmp = data[i].toString(16);
                                                if (tmp.length == 1) {
                                                    tmp = '0' + tmp;
                                                }
                                                dataarr[i] = tmp;
                                            }
                                            console.log(`the characteristics[0] response is: ${ '' + dataarr.join(' ')}`);
                                        });
                                        // characteristics[1].on('read', function (data, isNotification) {
                                        // console.log(`the characteristics[1] response is: ${ '' + data.toString()}`);
                                        // });

                                    });
                            }
                        });

                });
        });
});