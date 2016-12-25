var noble = require('noble');
import {scanDevice, promise} from './blescan';

export const sendData = (macAddress, command) => {};

export const discoveryServices = (macAddress) => {
    // 先扫描是否存在这个设备 console.log(scanDevice(macAddress));
    scanDevice(macAddress)
        .then((peripheral) => {
            console.log('then')
            if (peripheral) {
                console.log(peripheral);
                //连接设备（相当于gatttool的connect）
                peripheral.connect(function (error) {
                    if (error) {
                        console.log('an error occurred in peripheral.connect to: ' + peripheral.uuid);
                    }
                    console.log('connected to device: ' + peripheral.uuid);
                    peripheral.discoverServices(['636f6d2e6a6975616e2e414d56313200'], function (error, services) {
                        services.map((service, index) => {
                            console.log(service.uuid);
                        });

                    });
                });
            } else {
                console.log(`device ${macAddress} is not found.`);
            }
        }, function (error) {
            console.log('e');
        });

};
