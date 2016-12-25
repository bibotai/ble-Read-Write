var noble = require('noble');
import {scanDevice} from './blescan';

export const sendData = (macAddress, command) => {};

export const discoveryOneServices = (macAddress, serviceUuid) => {
    const promise = new Promise(function (resolve, reject) {
        console.log('start discoveringServices... ');
        // 先扫描是否存在这个设备 console.log(scanDevice(macAddress));
        scanDevice(macAddress).then((peripheral) => {
            if (peripheral) {
                //连接设备（相当于gatttool的connect）
                peripheral
                    .connect(function (error) {
                        if (error) {
                            console.log('an error occurred in peripheral.connect to: ' + peripheral.uuid);
                        }
                        console.log('connected to device: ' + peripheral.uuid);
                        //查找服务
                        peripheral.discoverServices([serviceUuid], function (error, services) {
                            if (error) {
                                reject(error);
                            } else {
                                console.log(`services ${serviceUuid} is found.`);
                                resolve(services[0]);
                            }

                        });
                    });
            } else {
                console.log(`device ${macAddress} is not found.`);
            }
        }, function (error) {
            console.log('e');
        });
    })
    return promise;
};

export const discoveryOneCharacteristics = (service, characteristicsUuid) => {

    console.log('start discoveringCharacteristics...');
    const promise = new Promise(function (resolve, reject) {
        //查找特性
        service
            .discoverCharacteristics([characteristicsUuid], function (error, characteristics) {
                if (error) {
                    reject(error);
                } else {
                    console.log(`characteristic ${characteristicsUuid} is found.`);
                    resolve(characteristics[0]);
                }

            });
    });
    return promise;
}

export const setNoifty = (characteristics, isListing) => {
    const promise = new Promise(function (resolve, reject) {
        characteristics
            .notify(true, function (error) {
                if (error) {
                    reject(error);
                } else {
                    console.log(`characteristic ${characteristics.uuid} noifty set to ${isListing}`);
                    resolve(true)
                }
            });
    });
    return promise;
}

export const writeCharacteristics = (characteristics, data) => {
    const promise = new Promise(function (resolve, reject) {
        characteristics
            .write(data, true, function (error) {
                if (error) {
                    reject(error);
                } else {
                    console.log(`write data ${data} to ${characteristics.uuid}`)
                    resolve(true)
                }
            });
    });
    return promise;
}

export const readCharacteristics = (characteristics) => {

    characteristics
        .on('read', function (data, isNotification) {
            if (error) {
                console.log(`an error occurred in readCharacteristics`)
            } else {
                console.log(`read data ${data} from ${characteristics.uuid}`)
                return data;
            }
        });
}