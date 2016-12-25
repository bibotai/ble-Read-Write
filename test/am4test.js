import {discoveryServices, discoveryCharacteristics} from '../ihealthdevicesdk/communication/base/ble/blebase';
const peripheralIdOrAddress = process
    .argv[2]
    .toLowerCase();
console.log(peripheralIdOrAddress);
discoveryServices(peripheralIdOrAddress, ['636f6d2e6a6975616e2e414d56313200']).then((service) => {
    discoveryCharacteristics(service, ['7365642e6a6975616e2e414d56313200'], function (error) {
        console.log(error)
    }).then((characteristics) => {
        characteristics
            .map(function (characteristic, index) {
                console.log(`this is the ${index} characteristic,uuid:${ '' + characteristic.uuid}`);

            });
    });
});