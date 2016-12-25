var noble = require('noble');
import {startScan, stopScan} from './blescan';

export const sendData = (macAddress, command) => {};

export const discoveryServices = (macAddress) => {
    startScan();
    noble.on('discover', function (peripheral) {
        if (peripheral.id === macAddress || peripheral.address === macAddress) {
            stopScan();
            console.log(`device ${macAddress} is found.`);
            peripheral.connect(function (error) {
                console.log('connected to peripheral: ' + peripheral.uuid);
                peripheral.connect(function (error) {
                    // console.log('connected to peripheral: ' + peripheral.uuid);
                    peripheral
                        .discoverServices(['636f6d2e6a6975616e2e414d56313200'], function (error, services) {
                            services.map((service, index) => {
                                console.log(service.uuid);
                            })

                        })
                })
            })
        }
    });
};
