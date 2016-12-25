var noble = require('noble');

export const sendData = ({macAddress, command}) => {};

export const discoveryServices = ({macAddress}) => {
    noble
        .on('discover', function (peripheral) {
            peripheral
                .connect(function (error) {
                    peripheral
                        .connect(function (error) {
                            // console.log('connected to peripheral: ' + peripheral.uuid);
                            peripheral
                                .discoverServices(['636f6d2e6a6975616e2e414d56313200'], function (error, services) {
                                    services.map((service, index) => {
                                        console.log(service.uuid);
                                    })

                                })
                        })
                })
        });
};
