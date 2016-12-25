var noble = require('noble');
import {scanDevice} from './blescan';

export const sendData = (macAddress, command) => {};

export const discoveryServices = (macAddress) => {
    //先扫描是否存在这个设备
    scanDevice(macAddress).then((peripheral) => {
        if (peripheral) {
            //连接设备（相当于gatttool的connect）
            peripheral
                .connect(function (error) {
                    if (error) {
                        console.log('an error occurred in peripheral.connect to: ' + peripheral.uuid.toUpCase());
                    }
                    console.log('connected to device: ' + peripheral.uuid.toUpCase());
                    peripheral.discoverServices(['636f6d2e6a6975616e2e414d56313200'], function (error, services) {
                        services.map((service, index) => {
                            console.log(service.uuid);
                        });

                    });
                });
        } else {
            console.log(`device ${macAddress} is not found.`);
        }
    });

};
