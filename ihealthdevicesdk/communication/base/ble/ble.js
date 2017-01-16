/**
 * Created by Fwind on 2016/12/28.
 */
import {discoveryOneServices, discoveryOneCharacteristics, setNoifty, writeCharacteristics, readCharacteristics} from './blebase';
import {Bytes2HexString} from "../../utils/ByteBufferUtil"
import {unPackageData} from "./BleUnpackageData"

export const onCharacteristicChanged = (device, data, uuid)=> {
    const promise=new Promise(function(resovle,reject) {
        let mac = device;
        //let uuidStr = uuid.toString();
        console.log("mac:" + mac + ",receive:" + Bytes2HexString(data));
        unPackageData(data).then((req)=>{
            resovle(req);
        });
    })
    return promise;
}