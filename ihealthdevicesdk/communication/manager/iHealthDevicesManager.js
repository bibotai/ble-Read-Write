/**
 * Created by Fwind on 2016/12/27.
 */
import {AppsDeviceParameters} from "../cloud/tools/AppsDeviceParameters"
import {getDevicePermisson} from "../cloudmanager/iHealthDeviceCloudManager"

export let DEVICE_STATE_CONNECTING = 0;
export let DEVICE_STATE_CONNECTED = 1;
export let DEVICE_STATE_DISCONNECTED = 2;
export let DEVICE_STATE_CONNECTIONFAIL = 3;
export let DEVICE_STATE_RECONNECTING = 4;

const TYPE_AM4 = "AM4";

export const startDiscovery = (type)=> {

}


export const connectDevice = (userName, mac, type)=> {
    if (mac != null && type != null && mac.length() >= 12 && type.length() > 0) {
        if (!AppsDeviceParameters.isUpLoadData || getDevicePermisson(userName, type)) {
            connectDevice(userName, mac);
            return true;
        }
    }
    onConnectionStateChange(mac, type, DEVICE_STATE_CONNECTIONFAIL, 0, null);
    return false;
}

const connectBleDevice = (deviceMac, type)=> {
    onConnectionStateChange(deviceMac, type, DEVICE_STATE_CONNECTING, 0, null);
    if (scanBlueDevicesMap.get(deviceMac) != null) {
        let result = false;

        //result = mBleComm.connectDevice(device.getAddress());

        Log.i(TAG, "connection result: " + result);
        if (!result) {
            onConnectionStateChange(deviceMac, type, DEVICE_STATE_CONNECTIONFAIL, 0, null)
        }
    }
}

//const connectDevice = (userName, mac)=> {
//    if (!AppsDeviceParameters.isUpLoadData || getDevicePermisson(userName, type)) {
//        connectBleDevice(mac, type);
//        return true;
//    } else {
//        onConnectionStateChange(mac, type, DEVICE_STATE_CONNECTIONFAIL, 0, null);
//        return false;
//    }
//}


/**
 * 连接状态
 * @param mac
 * @param type
 * @param status
 * @param errorID
 * @param manufactorData
 */
export const onConnectionStateChange = (mac, type, status, errorID, manufactorData)=> {
    let reConnectedFlag = false;
    if (DEVICE_STATE_CONNECTED === status) {
        if (connectedDeviceMap.get(mac) != null) {
            reConnectedFlag = true;
        } else {
            addDevice(mac, type);
        }
    } else if (DEVICE_STATE_DISCONNECTED === status) {
        if (connectedDeviceMap.get(mac) === null) {
            status = DEVICE_STATE_CONNECTIONFAIL;
        }
        if (mac != null)
            removeDevice(mac, type);
    } else {
        if (mac != null)
            removeDevice(mac, type);
    }
    if (reConnectedFlag === false) {
        mConnectionThread.setConnectionMessage(mac, type, status, errorID, manufactorData);
        mainThreadHandler.postDelayed(mConnectionThread, 100);
    }
}