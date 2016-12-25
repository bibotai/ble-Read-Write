var noble = require('noble');
import {startScan} from './blescan';

startScan;
export const sendData = (macAddress, command) => {};

export const discoveryServices = (macAddress) => {
    console.log(macAddress);
    noble.on('discover', function (peripheral) {
        peripheral
            .connect(function (error) {
                console.log('connected to peripheral: ' + peripheral.uuid);
                peripheral.connect(function (error) {
                    // console.log('connected to peripheral: ' + peripheral.uuid);
                    peripheral
                        .discoverServices(['636f6d2e6a6975616e2e414d56313200'], function (error, services) {
                            console.log(services.length);
                            services.map((service, index) => {
                                console.log(service.uuid);
                            })

                        })
                })
            })
    });
};
