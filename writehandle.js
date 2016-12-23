/**
 * Created by Administrator on 2016/12/22.
 */
var noble = require('noble');

var async = require('async');


var peripheralIdOrAddress = "00:4D:32:07:90:9D".toLowerCase();
//process.argv[2].toLowerCase();

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


    peripheral.connect(function (error) {
        console.log("error:" + error);
        //peripheral.writeHandle(0x0013, new Buffer([0x01,0x00]),
        //    false, function (error) {
        //        console.log("writeHandle:" + error);
        //        peripheral.on('writeHandle', function (data, isNotification) {
        //            var result = data.readUInt8(0);
        //            console.log("write:" + data + "," + error + "," + result + "," + isNotification);
        //        });
        //        //callback();
        //    });

        //async.series([
        //    function (callback) {
        console.log("begin....");
        peripheral.writeHandle(0x0013, new Buffer([0x01, 0x00]),
            false, function (error) {
                console.log("writeHandle13:" + error);

                //peripheral.readHandle(0x0013, function (error, data) {
                //    console.log("readHandle13:" + error + "," + data);
                //    callback();
                //});


                //认证
                //peripheral.writeHandle(0x0015, new Buffer([0xb0, 0x11, 0x11, 0x01, 0xaa, 0xfa, 0x51, 0x52, 0x03, 0x5e, 0x63, 0x49, 0x3d, 0x42, 0x68, 0x1e, 0x08, 0x45, 0x54, 0x0c]),
                //    true, function (error) {
                //console.log("writeHandle15:" + error);
                //peripheral.readHandle(0x0017, function (error, data) {
                //    console.log("readHandle15:" + error + "," + data.toString("hex"));
                //    callback();
                //});


                //var serviceIndex = 0;
                //peripheral.discoverServices([], function (error, services) {
                //    //console.log("services:" + services);
                //    var service = services[serviceIndex];
                //
                //    service.discoverCharacteristics([], function (error, characteristics) {
                //        var characteristicIndex = 0;
                //
                //        //console.log("characteristics:" + characteristics);
                //        var characteristic = characteristics[characteristicIndex];
                //        characteristic.on('data', function (data, isNotification) {
                //            var result = data.readUInt8(0);
                //            console.log("write:" + data + "," + error + "," + result + "," + isNotification);
                //        });
                //
                //        characteristic.read(function (error, data) {
                //            console.log("read:" + data + "," + error);
                //            callback();
                //        });
                //
                //        characteristic.subscribe(function (error) {
                //            characteristic.on('data', function (data, isNotification) {
                //                console.log('bake error:' + data + "," + isNotification);
                //                callback();
                //            });
                //        });
                //
                //        async.series([
                //            function (callback) {
                //                characteristic.subscribe(function (error) {
                //                    characteristic.on('data', function (data, isNotification) {
                //                        console.log('bake error:' + data + "," + isNotification);
                //                        callback();
                //                    });
                //                });
                //            },
                //
                //            //function (callback) {
                //            //    characteristic.on('read', function (data, isNotification) {
                //            //        console.log("read-isNotification:" + data + "," + isNotification);
                //            //        callback();
                //            //    });
                //            //}
                //        ])
                //    })
                //});

                //});
            });

        //}

        //function (callback) {
        //    peripheral.writeHandle(0x0015, new Buffer([0xb0, 0x11, 0x11, 0x01, 0xaa, 0xfa, 0x51, 0x52, 0x03, 0x5e, 0x63, 0x49, 0x3d, 0x42, 0x68, 0x1e, 0x08, 0x45, 0x54, 0x0c]),
        //        false, function (error) {
        //            console.log("writeHandle15:" + error);
        //            //peripheral.on('read', function (data, isNotification) {
        //            //    var result = data.readUInt8(0);
        //            //    console.log("write:" + data + "," + error + "," + result + "," + isNotification);
        //            //});
        //
        //            peripheral.readHandle(0x0015, function (error, data) {
        //                console.log("readHandle15:" + error + "," + data);
        //                callback();
        //            });
        //            callback();
        //        });
        //},
        //function (callback) {
        //    peripheral.readHandle(0x0015, function (error) {
        //        console.log("readHandle15:" + error);
        //        callback();
        //    });
        //},

        //])
    });
}

