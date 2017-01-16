/**
 * Created by Fwind on 2016/12/27.
 */
import {packageData} from "../base/protocol/blecommprotocol"
import {identify,deciphering} from "../ins/IdentifyIns"
import {
    onConnectionStateChange,
    DEVICE_STATE_CONNECTED,
    DEVICE_STATE_CONNECTING,
    DEVICE_STATE_DISCONNECTED,
    DEVICE_STATE_CONNECTIONFAIL,
    DEVICE_STATE_RECONNECTING}
    from "../manager/iHealthDevicesManager"

let deviceType = 0xaa;
let mAddress, mType = "AM4", mUserName;

mAddress = "00:4D:32:07:90:9D".toLowerCase();

//AaInsSet = (mac, type, userName)=> {
//    mAddress = mac;
//    mType = type;
//    mUserName = userName;
//}

//export const identifys = ()=> {
packageData(mAddress, identify(deviceType));
//}

export const haveNewData = (what, statId, returnData)=>{
    console.log("haveNewData" + what);
    const promise=new Promise(function(resole,reject){
        switch (what) {
            case 0xfb:
                console.log("0xfb");
                deciphering(returnData, mType, deviceType).then((req)=> {
                    packageData(mAddress, req);
                });
                break;
            case 0xfd:
                console.log("identify success!");
                onConnectionStateChange(mAddress, mType, DEVICE_STATE_CONNECTED, 0, null);
                break;
        }
        resole("haveNewData"+what);
    })
    return promise;
}









