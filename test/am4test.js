import {discoveryOneServices, discoveryOneCharacteristics} from '../ihealthdevicesdk/communication/base/ble/blebase';
const peripheralIdOrAddress = process
    .argv[2]
    .toLowerCase();
console.log(peripheralIdOrAddress);
discoveryOneServices(peripheralIdOrAddress, '636f6d2e6a6975616e2e414d56313200').then((service) => {
    discoveryOneCharacteristics(service, '7365642e6a6975616e2e414d56313200', function (error) {
        console.log(error)
    }).then((characteristic) => {
        console.log(characteristic)
    });
});