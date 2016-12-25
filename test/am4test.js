import {discoveryServices} from '../ihealthdevicesdk/communication/base/ble/blebase';
const peripheralIdOrAddress = process
    .argv[2]
    .toLowerCase();
console.log(peripheralIdOrAddress);
discoveryServices(peripheralIdOrAddress);