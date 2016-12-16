// var noble = require('noble');
import {noble} from 'noble';
state = "poweredOn"
noble.on('stateChange', callback(state));

noble.startScanning(); // any service UUID, no duplicates