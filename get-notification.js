/**
 * Created by Administrator on 2016/12/23.
 */
var noble = require('noble');

var async = require('async');

var peripheralIdOrAddress = "00:4D:32:07:90:9D".toLowerCase();

noble.on('stateChange', function (state) {
    if (state === 'poweredOn') {
        noble.startScanning();
    } else {
        noble.stopScanning();
    }
});

noble.on('discover', function (peripheral) {
    if (peripheral.id === peripheralIdOrAddress || peripheral.address === peripheralIdOrAddress) {
        noble.stopScanning();
        console.log('peripheral with ID ' + peripheral.id + ' found');
        explore(peripheral);
    }
});

function explore(peripheral) {
    console.log('services and characteristics:');

    peripheral.on('disconnect', function () {
        process.exit(0);
    });

    peripheral.on('handleWrite' + 0x0015, function () {
        console.log("writeHandle data!");
    });


    peripheral.connect(function (error) {
        //console.log("error:" + error);
        async.series([
            function (callback) {
                console.log("begin....");
                peripheral.writeHandle(0x0013, new Buffer([0x01, 0x00]),
                    false, function (error) {
                        console.log("writeHandle13 error:" + error);
                        callback();
                    });
                peripheral.writeHandle(0x0015, new Buffer([0xb0, 0x11, 0x11, 0x01, 0xaa, 0xfa, 0x51, 0x52, 0x03, 0x5e, 0x63, 0x49, 0x3d, 0x42, 0x68, 0x1e, 0x08, 0x45, 0x54, 0x0c]),
                    true, function (error) {
                        console.log("writeHandle15 error:" + error);
                        callback();
                    });
            }, function (err) {
                //console.log("err:" + err);
                peripheral.disconnect();
            }
        ]);
    });
}

