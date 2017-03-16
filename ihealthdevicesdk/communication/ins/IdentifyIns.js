/**
 * Created by Fwind on 2016/12/28.
 */
import {AppsDeviceParameters} from "../cloud/tools/AppsDeviceParameters"
import {encrypt} from "../ins/XXTEA"
import {getKas} from "../ins/GenerateKap"
import {BleConfig} from "../base/ble/BleConfig"


let R1 = new Buffer(16);// 随机数R1——用于认证发给下位机
let R1_stroke = new Buffer(16);// R1'——用于保存下位机传上来的R1'
let R1_back = new Buffer(16);// R1——对下位机传上来的R1'进行解密后生成的R1，用于比较随机数R1

let R2_stroke = new Buffer(16);// R2'——用于保存下位机传上来的R2'
let R2 = new Buffer(16);// R2——对R2'解密后生成的R2
let deviceID = new Buffer(16);// 下位机传上来的产品ID
let k = new Buffer(16);



export const identify = (deviceType)=> {
    let r1 = setR1();
    let len = r1.length + 2;
    let returnCommand = new Buffer(len);
    let commandID = 0xfa;
    returnCommand[0] = deviceType;
    returnCommand[1] = commandID;
    for (let i = 2; i < returnCommand.length; i++) {
        returnCommand[i] = r1[i - 2];
    }
    return returnCommand;
}

const getDeviceId = ()=> {
    return deviceID;
}

export const deciphering = (returnData, strType, bType) => {
    console.log("deciphering" + returnData.length + "," + AppsDeviceParameters.isLog);
    const promise = new Promise(function (resolve, reject) {
        if (returnData.length === 48) {
            // 解析ID R1' 和 R2'
            for (let i = 0; i < 16; i++) {
                deviceID[i] = returnData[i];
                R1_stroke[i] = returnData[i + 16];
                R2_stroke[i] = returnData[i + 32];
            }
        } else {
            if (AppsDeviceParameters.isLog)
                console.log(BleConfig.TAG + "R1 + R2 + ID 的长度不是48");
        }
        K = encrypt(reverseByteArray(deviceID), getKa(strType));
        if (AppsDeviceParameters.isLog)
            console.log(BleConfig.TAG + "      k:" + K);
        R1_back = encrypt(reverseByteArray(R1_stroke), K);
        if (AppsDeviceParameters.isLog)
            console.log(BleConfig.TAG + "R1_back:" + R1_back);
        R2 = encrypt(reverseByteArray(R2_stroke), K);
        if (AppsDeviceParameters.isLog)
            console.log(BleConfig.TAG + "     R2:" + R2);
        let _R2 = reverseByteArray(R2);
        if (AppsDeviceParameters.isLog)
            console.log(BleConfig.TAG + "    _R2:" + _R2);
        decipheringMessage(_R2, bType).then((returnCommand)=> {
            resolve(returnCommand);
        })
    })
    return promise;

}

const reverseByteArray = (data)=> {
    let result = new Buffer(16);
    for (let i = 0; i < 4; i++) {
        result[i] = data[3 - i];
        result[i + 4] = data[7 - i];
        result[i + 8] = data[11 - i];
        result[i + 12] = data[15 - i];
    }
    return result;
}

const setR1 = ()=> {
    const hex = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
    for (let i = 0; i < 16; i++) {
        let first = randomNum(15, 0);
        let second = randomNum(15, 0);
        //console.log("R1"+"0x" + hex[first] + hex[second]);
        R1[i] = new Buffer("0x" + hex[first] + hex[second]);
    }
    console.log("setR1" + R1.length + "," + R1[2]);
    return reverseByteArray(R1);
}

const randomNum = (max, min)=> {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const decipheringMessage = (r2, deviceType)=> {
    const promise = new Promise(function (resolve, reject) {
        let len = r2.length + 2;
        let returnCommand = new Buffer([len]);
        let commandID = new Buffer([0xFC]);
        returnCommand[0] = deviceType;
        returnCommand[1] = commandID;
        for (let i = 2; i < returnCommand.length; i++) {
            returnCommand[i] = r2[i - 2];
        }
        resolve(returnCommand);
    })
    return promise;
};

const getKa = (type)=> {
    const promise = new Promise(function (resolve, reject) {
        if (AppsDeviceParameters.isLog)
            console.log(BleConfig.TAG + "type:" + type);
        encrypt(swapByteArray(getKas(type)), swapByteArray(KeyOut)).then((ka)=> {
            if (AppsDeviceParameters.isLog)
                console.log(BleConfig.TAG + "value = \n" + ka);//Ka
            resolve(ka)
        });
    })
    return promise;

}

const swapByteArray = (data)=> {
    const promise = new Promise(function (resolve, reject) {
        let result = new Buffer([data.length]);
        for (let i = 0; i < data.length; i++) {
            result[i] = new Buffer(((data[i] & 0x0F) << 4) | ((data[i] & 0xF0) >> 4));
        }
        resolve(result);
    })
    return promise;
}