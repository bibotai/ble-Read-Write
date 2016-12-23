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

        async.series([
            function () {
                peripheral.writeHandle(new Buffer([0x0013]), new Buffer([0x0100]),
                    false, function (error) {
                        console.log("writeHandle:" + error);
                    });
            },
            function () {
                peripheral.writeHandle(new Buffer([0x0015]), new Buffer([0xb0, 0x11, 0x11, 0x01, 0xaa, 0xfa, 0x51, 0x52, 0x03, 0x5e, 0x63, 0x49, 0x3d, 0x42, 0x68, 0x1e, 0x08, 0x45, 0x54, 0x0c]),
                    false, function (error) {
                        console.log("writeHandle:" + error);
                    });
            }
        ])


        peripheral.writeHandle(0x0013, new Buffer([0x01, 0x00]),
            false, function (error) {
                console.log("writeHandle:" + error);

                peripheral.discoverServices([], function (error, services) {
                    var serviceIndex = 0;

                    async.whilst(
                        function () {
                            return (serviceIndex < services.length);
                        },
                        function (callback) {
                            //console.log("services:"+services);
                            var service = services[serviceIndex];
                            var serviceInfo = service.uuid;

                            if (service.name) {
                                serviceInfo += ' (' + service.name + ')';
                            }
                            console.log(serviceInfo);

                            service.discoverCharacteristics([], function (error, characteristics) {
                                var characteristicIndex = 0;

                                async.whilst(
                                    function () {
                                        return (characteristicIndex < characteristics.length);
                                    },
                                    function (callback) {
                                        //console.log("characteristics:" + characteristics);
                                        //if (
                                        //    characteristics[characteristicIndex].uuid != '7365642e6a6975616e2e414d56313200'
                                        //    ||
                                        //    characteristics[characteristicIndex].uuid != '7265632e6a6975616e2e414d56313200'
                                        //) {
                                        //    characteristicIndex++;
                                        //    callback();
                                        //    return;
                                        //}

                                        //console.log("uuid:"+characteristics[characteristicIndex].uuid);
                                        var characteristic = characteristics[characteristicIndex];
                                        //console.log("characteristics[characteristicIndex]" + characteristics[characteristicIndex]);
                                        var characteristicInfo = '  ' + characteristic.uuid;

                                        if (characteristic.name) {
                                            characteristicInfo += ' (' + characteristic.name + ')';
                                        }

                                        async.series([
                                            function (callback) {
                                                characteristic.discoverDescriptors(function (error, descriptors) {
                                                    async.detect(
                                                        descriptors,
                                                        function (descriptor, callback) {
                                                            return callback(descriptor.uuid === '2901');
                                                        },
                                                        function (userDescriptionDescriptor) {
                                                            if (userDescriptionDescriptor) {
                                                                userDescriptionDescriptor.readValue(function (error, data) {
                                                                    if (data) {
                                                                        characteristicInfo += ' (' + data.toString() + ')';
                                                                    }
                                                                    callback();
                                                                });
                                                            } else {
                                                                callback();
                                                            }
                                                        }
                                                    );
                                                });
                                            },
                                            function (callback) {
                                                characteristicInfo += '\n    properties  ' + characteristic.properties.join(', ');
                                                console.log("properties:" + characteristic.properties.indexOf('write')
                                                    + "," + characteristic.properties.indexOf('notify')
                                                    + "," + characteristic.properties.indexOf('writeWithoutResponse'));
                                                //if (characteristic.properties.indexOf('write') !== -1) {
                                                console.log("characteristic.uuid:" + characteristics[characteristicIndex].uuid);


                                                //characteristic.on('data', function(data, isNotification){
                                                //    console.log("data-isNotification:" + data + "," + isNotification);
                                                //    callback();
                                                //});
                                                //
                                                //characteristic.on('read', function(data, isNotification){
                                                //    console.log("read-isNotification:" + data + "," + isNotification);
                                                //    callback();
                                                //});


                                                if (characteristics[characteristicIndex].uuid === '7365642e6a6975616e2e414d56313200') {
                                                    console.log("write-enable!");
                                                    async.series([
                                                        function (callback) {
                                                            characteristic.write(new Buffer([0x01, 0x00]), false, function (error, data) {
                                                                console.log("write11:" + data + "," + error);
                                                                callback();
                                                            });
                                                        }
                                                    ])

                                                }
                                                else if (characteristics[characteristicIndex].uuid === '7265632e6a6975616e2e414d56313200') {
                                                    console.log("auth!");
                                                    async.series([
                                                        //认证
                                                        function (callback) {
                                                            characteristic.write(new Buffer([0xb0, 0x11, 0x11, 0x01, 0xaa, 0xfa, 0x51, 0x52, 0x03, 0x5e, 0x63, 0x49, 0x3d, 0x42, 0x68, 0x1e, 0x08, 0x45, 0x54, 0x0c]),
                                                                false, function (error) {
                                                                    console.log("write:" + "," + error);
                                                                    characteristic.on('read', function (data, isNotification) {
                                                                        var result = data.readUInt8(0);
                                                                        console.log("isNotification:" + data + "," + error + "," + result + "," + isNotification);
                                                                    });

                                                                    //characteristic.subscribe(function (err) {
                                                                    //    characteristic.write(new Buffer([0xb0, 0x06, 0x10, 0x03, 0xaa, 0x24, 0x58, 0x09, 0x42]),
                                                                    //        false, function (err) {
                                                                    //            if (err) {
                                                                    //                console.log('bake error');
                                                                    //            }
                                                                    //        });
                                                                    //});


                                                                    characteristic.subscribe(function (error) {
                                                                        characteristic.on('data', function (data, isNotification) {
                                                                            console.log('bake error:'+data+","+isNotification);
                                                                        });
                                                                    });

                                                                    callback();
                                                                });

                                                        },
                                                        //function (callback) {
                                                        //    //characteristic.on('data', function (data, isNotification) {
                                                        //    characteristic.once('read', function(data, isNotification){ // legacy
                                                        //        console.log("data:" + data + "," + isNotification);
                                                        //        callback();
                                                        //    });
                                                        //},
                                                        function (callback) {
                                                            characteristic.read(function (error, data) {
                                                                console.log("read:" + data + "," + error);
                                                                callback();
                                                            });
                                                            //characteristic.on('read', function (data, isNotification) {
                                                            //    var result = data.readUInt8(0);
                                                            //    console.log("read:" + data + "," + error + "," + result + "," + isNotification);
                                                            //    callback();
                                                            //});
                                                        },
                                                        function (callback) {
                                                            characteristic.write(new Buffer([0xb0, 0x06, 0x10, 0x03, 0xaa, 0x24, 0x58, 0x09, 0x42]), false, function (error, data) {
                                                                console.log("write:" + data + "," + error);
                                                                callback();
                                                            });
                                                        },
                                                        function (callback) {
                                                            characteristic.write(new Buffer([0xb0, 0x03, 0xa3, 0x07, 0xaa, 0x54]), false, function (error, data) {
                                                                console.log("write:" + data + "," + error);
                                                                callback();
                                                            });
                                                        },
                                                        function (callback) {
                                                            characteristic.write(new Buffer([0xb0, 0x03, 0xa3, 0x07, 0xaa, 0x55]), false, function (error, data) {
                                                                console.log("write:" + data + "," + error);
                                                                callback();
                                                            });
                                                        },
                                                        function (callback) {
                                                            characteristic.write(new Buffer([0xb0, 0x03, 0xa3, 0x07, 0xaa, 0x56]), false, function (error, data) {
                                                                console.log("write:" + data + "," + error);
                                                                callback();
                                                            });
                                                        },
                                                        function (callback) {
                                                            characteristic.write(new Buffer([0xb0, 0x03, 0xa3, 0x07, 0xaa, 0x57]), false, function (error, data) {
                                                                console.log("write:" + data + "," + error);
                                                                callback();
                                                            });
                                                        },
                                                        function (callback) {
                                                            characteristic.write(new Buffer([0xb0, 0x11, 0x11, 0x0f, 0xaa, 0xfc, 0xc8, 0xd6, 0x9c, 0x29, 0x1d, 0x4a, 0x35, 0x94, 0xef, 0x4d, 0x76, 0x24, 0x9b, 0xca]), false, function (error, data) {
                                                                console.log("write:" + data + "," + error);
                                                                callback();
                                                            });
                                                        },
                                                        function (callback) {
                                                            characteristic.write(new Buffer([0xb0, 0x06, 0x10, 0x11, 0xaa, 0x2a, 0x1d, 0x0a, 0x1c]), false, function (error, data) {
                                                                console.log("write:" + data + "," + error);
                                                                callback();
                                                            });
                                                        },
                                                        function (callback) {
                                                            characteristic.write(new Buffer([0xb0, 0x03, 0xa0, 0x15, 0xaa, 0x5f]), false, function (error, data) {
                                                                console.log("write:" + data + "," + error);
                                                                callback();
                                                            });
                                                        },

                                                        //获取电量
                                                        function (callback) {
                                                            characteristic.write(new Buffer([0xb0, 0x04, 0x00, 0x17, 0xaa, 0xb4, 0x75]), false, function (error, data) {
                                                                console.log("write:" + data + "," + error);
                                                                callback();
                                                            });
                                                        },
                                                        function (callback) {
                                                            characteristic.write(new Buffer([0xb0, 0x03, 0xa0, 0x1b, 0xaa, 0xb5]), true, function (error, data) {
                                                                console.log("write:" + data + "," + error);
                                                                callback();
                                                            });
                                                        }
                                                    ])
                                                }
                                                callback();

                                                //} else {
                                                //    callback();
                                                //}
                                            },
                                            function () {
                                                //console.log(characteristicInfo);
                                                characteristicIndex++;
                                                callback();
                                            }
                                        ]);
                                    },
                                    function (error) {
                                        serviceIndex++;
                                        callback();
                                    }
                                );
                            });
                        },
                        function (err) {
                            peripheral.disconnect();
                        }
                    );
                });
            })
    });
}

