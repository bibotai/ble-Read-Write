var noble = require('noble');
import {scanDevice} from './blescan';

export const sendData = (macAddress, command) => {};

export const discoveryServices = (macAddress, serviceUuidArr) => {
    const promise = new Promise(function (resolve, reject) {
        // 先扫描是否存在这个设备 console.log(scanDevice(macAddress));
        scanDevice(macAddress)
            .then((peripheral) => {
                console.log('then')
                if (peripheral) {
                    //连接设备（相当于gatttool的connect）
                    peripheral
                        .connect(function (error) {
                            if (error) {
                                console.log('an error occurred in peripheral.connect to: ' + peripheral.uuid);
                            }
                            console.log('connected to device: ' + peripheral.uuid);
                            //查找服务
                            peripheral.discoverServices(serviceUuidArr, function (error, services) {
                                if (error) {
                                    reject(error);
                                } else {
                                    console.log(`services ${serviceUuidArr.join(',')} are found.`);
                                    resolve(services);
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

export const discoveryCharacteristics = (service, characteristicsUuidArr) => {
    const promise = new Promise(function (resolve, reject) {
        //查找特性
        service
            .discoverCharacteristics(characteristicsUuidArr, function (error, characteristics) {
                if (error) {
                    reject(error);
                } else {
                    console.log(`characteristic ${characteristicsUuidArr.join(',')} are found.`);
                    resolve(characteristics);
                }

            });
    });
    return promise;
}