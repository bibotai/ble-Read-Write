import {discoveryOneServices, discoveryOneCharacteristics, setNoifty, writeCharacteristics, readCharacteristics} from '../ihealthdevicesdk/communication/base/ble/blebase';
const peripheralIdOrAddress = process
    .argv[2]
    .toLowerCase();

const notifyCharacteristic = null;
const writeCharacteristic = null;

const interval = setInterval(function () {
    if (notifyCharacteristic) {
        console.log('has notifyCharacteristic  ');
        readCharacteristics(notifyCharacteristic);
        clearInterval(interval);
    }
})

console.log(peripheralIdOrAddress);
discoveryOneServices(peripheralIdOrAddress, '636f6d2e6a6975616e2e414d56313200').then((service) => {
    discoveryOneCharacteristics(service, '7265632e6a6975616e2e414d56313200', function (error) {
        console.log(error)
    }).then((characteristic) => {
        this.notifyCharacteristic = characteristic;
        setNoifty(characteristic, true).then(discoveryOneCharacteristics(service, '7365642e6a6975616e2e414d56313200').then((characteristic) => {
            this.writeCharacteristic = characteristic;
            writeCharacteristics(characteristic, new Buffer([
                0xb0,
                0x11,
                0x11,
                0x01,
                0xaa,
                0xfa,
                0x51,
                0x52,
                0x03,
                0x5e,
                0x63,
                0x49,
                0x3d,
                0x42,
                0x68,
                0x1e,
                0x08,
                0x45,
                0x54,
                0x0c
            ]))
        }))
    });
});
