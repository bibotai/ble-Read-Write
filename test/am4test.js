import {discoveryOneServices, discoveryOneCharacteristics, setNoifty, writeCharacteristics, readCharacteristics} from '../ihealthdevicesdk/communication/base/ble/blebase';
const peripheralIdOrAddress = process
    .argv[2]
    .toLowerCase();

let notifyCharacteristic = null;
let writeCharacteristic = null;
let notifyservice = null;

console.log(peripheralIdOrAddress);
discoveryOneServices(peripheralIdOrAddress, '636f6d2e6a6975616e2e414d56313200').then((service) => {
    notifyservice = service;
    discoveryOneCharacteristics(service, '7365642e6a6975616e2e414d56313200').then((characteristic) => {
        notifyCharacteristic = characteristic;
        //开启通知监听
        setNoifty(notifyCharacteristic, true);
        discoveryOneCharacteristics(service, '7265632e6a6975616e2e414d56313200').then((characteristic) => {
            // console.log(characteristic);
            writeCharacteristic = characteristic
            writeCharacteristics(writeCharacteristic, new Buffer([
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
            ]));
            const data = readCharacteristics(notifyCharacteristic, function (data) {
                let dataarr = [];
                for (let i = 0; i < data.length; i++) {
                    let tmp = data[i].toString(16);
                    if (tmp.length == 1) {
                        tmp = '0' + tmp;
                    }
                    dataarr[i] = tmp;
                }
                console.log(`the data is ${dataarr.join(' ')}`);
            });

        });

    });
});
