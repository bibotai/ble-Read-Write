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
                                .discoverServices([], function (error, services) {
                                    services.map((service, index) => {
                                        console.log(service.uuid);
                                    })

                                })
                        })
                })
        });
};
