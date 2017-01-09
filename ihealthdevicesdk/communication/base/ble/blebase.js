var noble = require('noble');
var async = require('async');
import {scanDevice} from './blescan';

export const sendData = (macAddress, command) => {
};

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
                                console.log(`service ${serviceUuid} is found.`);
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
    console.log(`start setNoifty to ${characteristics.uuid}...`);
    characteristics.notify(isListing, function (error) {
        console.log(`characteristic notify`);
        if (error) {
            console.log(`an error occurred in setNoifty`)
        } else {
            console.log(`characteristic ${characteristics.uuid} noifty set to ${isListing}`);

        }
    });
}

export const writeCharacteristics = (characteristics, data) => {
    characteristics
        .write(data, true, function (error) {
            if (error) {
                console.log(`an error occurred in writeCharacteristics`);
            } else {
                console.log(`write data ${data.toString('ascii')} to ${characteristics.uuid}`)
            }
        });
}

export const readCharacteristics = (characteristics, callback) => {
    console.log(`start reading data from ${characteristics.uuid}...`)
    characteristics.on('read', function (data, isNotification) {
        console.log(`the characteristics[0] response is: ${data.toString('ascii')}`);
        callback(data);

    });
}

export const disconnect = ()=> {
    process.exit(0);

}



