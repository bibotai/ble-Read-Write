var noble = require('noble');
var async = require('async');
import  {SendData} from '../ble/ble'
import {
    discoveryOneServices,
    discoveryOneCharacteristics,
    setNoifty,
    writeCharacteristics,
    readCharacteristics,
    disconnect} from '../ble/blebase';
import {onCharacteristicChanged} from "../ble/ble"

let trasmitHead = 0xb0;
let commandSequenceId = 1;
let dataGueue = new Array();
let commandGueue = new Array();
let SendStatus = false;
let UNKOWN_SUPPORTCHARACTERWRITE = 2;
let NOT_SUPPORTCHARACTERWRITE = 3;
let SUPPORTCHARACTERWRITE = 4;
let isSupportOnCharacterWrite = UNKOWN_SUPPORTCHARACTERWRITE;

let notifyCharacteristic = null;
let writeCharacteristic = null;
let notifyservice = null;

let mType, mAddress;

const getSequenceId = ()=> {
    return commandSequenceId & 0xff;
}

const setSequenceId = (sequenceId)=> {
    commandSequenceId = sequenceId;
}

const addSequenceId = (index)=> {
    commandSequenceId += index;
}

const setSendStatus = (status)=> {
    SendStatus = status;
}

const getSendStatus = ()=> {
    return SendStatus;
}

export const packageData = (mac, data) => {
    data.forEach(function (item) {
        dataGueue.unshift(item);
        //console.log("dataGueue" + item.toString(16))
    });
    let dataarr = [];
    for (let i = 0; i < dataGueue.length; i++) {
        let tmp = dataGueue[i].toString(16);
        if (tmp.length == 1) {
            tmp = '0' + tmp;
        }
        dataarr[i] = tmp;
    }
    console.log("dataarr：" + dataarr.join(' '))
    discoveryOneServices(mac, '636f6d2e6a6975616e2e414d56313200').then((service) => {

        notifyservice = service;
        discoveryOneCharacteristics(service, '7365642e6a6975616e2e414d56313200').then((characteristic) => {
            notifyCharacteristic = characteristic;
            //开启通知监听
            setNoifty(notifyCharacteristic, true);
            discoveryOneCharacteristics(service, '7265632e6a6975616e2e414d56313200').then((characteristic) => {
                // console.log(characteristic);
                writeCharacteristic = characteristic;


                if (dataGueue.length <= 15) {
                    console.log(`directSend`)
                    directSend(mac);
                } else {
                    console.log(`splitSend`)
                    splitSend(mac);
                }
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


                    console.log("开始收包   *************************************");
                    //收包解包
                    onCharacteristicChanged(mac, data, 0).then((req)=>{
                        console.log("onCharacteristicChanged:"+req);
                    });

                    //断开
                    //disconnect();

                })
            })
        })
    })

};

const splitSend = (mac) => {
    let productId = dataGueue.pop();
    console.log("productId:" + productId);
    let size = dataGueue.length;
    let count = splitCount(size);
    let temp1 = ((count.length - 1) << 4);
    let temp2 = (count.length - 1);
    let list = new Array();
    for (let i = 0; i < count.length; i++) {
        let len = count[i];
        let commandtemp = new Buffer(len + 6);
        commandtemp[0] = trasmitHead;
        commandtemp[1] = (len + 3);
        commandtemp[2] = (temp1 + temp2 - i);
        console.log("temp1+temp2" + commandtemp[2]);
        commandtemp[3] = getSequenceId();
        commandtemp[4] = productId;
        for (let j = 0; j < len; j++) {
            commandtemp[5 + j] = dataGueue.pop();
            console.log("commandtemp" + len + "," + commandtemp[5 + j]);
        }
        commandtemp[len + 5] = generateCKS(commandtemp);
        list.push(commandtemp);

        addSequenceId(2);

    }
    list.forEach(function (item, index) {
        console.log("list" + index);
        commandGueue.unshift(item);
    });


    if (!getSendStatus()) {
        setSendStatus(true);
        if (isSupportOnCharacterWrite === UNKOWN_SUPPORTCHARACTERWRITE) {
            setTimeout(function () {
                run();
            }, 100)
        } else if (isSupportOnCharacterWrite === NOT_SUPPORTCHARACTERWRITE) {
            setTimeout(function () {
                run();
            }, 10)
        } else {
            //let bs = commandGueue.pop();
            //let sequenceId = (bs[3] & 0xff);
            //mapTimeoutCommand.put(sequenceId, bs);
            //SendData(mac, bs, function (data) {
            //    console.log("splitSend" + data);
            //});
            run();
        }
    }
}

const splitCount = (size)=> {
    let time = size / 14 + 1;
    let off = size % 14;
    let times = [time];
    for (let i = 0; i < time - 1; i++) {
        times[i] = 14;
    }
    times[parseInt(time - 1)] = off;
    return times;
}

const directSend = (mac) => {
    let len = dataGueue.length + 2;
    let lenFull = len + 3;
    let commandtemp = new Buffer(lenFull);
    commandtemp[0] = trasmitHead;
    commandtemp[1] = new Buffer([len + 3]);
    commandtemp[2] = 0x00;
    commandtemp[3] = getSequenceId();
    for (let i = 0; i < (len - 2); i++) {
        commandtemp[4 + i] = dataGueue.pop();
    }
    commandtemp[lenFull - 1] = generateCKS(commandtemp);
    commandGueue.unshift(commandtemp);
    addSequenceId(2);
    if (!getSendStatus()) {
        setSendStatus(true);
        if (isSupportOnCharacterWrite === NOT_SUPPORTCHARACTERWRITE) {
            setTimeout(function () {
                run();
            }, 10)
        } else {
            //let command = commandGueue.pop();
            //let sequenceId = (bs[3] & 0xff);
            //SendData(mac, command, function (data) {
            //    console.log("directSend" + data);
            //});

            run();
        }

    }
};


const generateCKS = (command) => {
    let sum = 0;
    for (let i = 2; i < command.length - 1; i++) {
        sum += command[i];
    }
    return sum;
};

export const unPackageData = (characteristicChangedValue)=> {
    if (characteristicChangedValue[0] != new Buffer([0xA0])) {
        console.log("head byte is not A0");
        return;
    }
    let len = characteristicChangedValue[1];
    let lenR = characteristicChangedValue.length;
    if (lenR < 6) {
        console.log("command length is not wrong");
        return;
    }
    let seqID = characteristicChangedValue[3];
    let tempSeqID = 0;
    if (seqID == 0) {
        tempSeqID = 255;
    } else {
        tempSeqID = (seqID & 0xFF) - 1;
    }
    let tempask = tempSeqID;
    //if (lenR == 6) {
    //    mapTimeoutCommand.remove(tempSeqID);
    //}
    if (len != lenR - 3) {
        console.log("This is not full command");
        return;
    }

    if (!checkCKS(2, lenR - 2, characteristicChangedValue)) {
        console.log("checksum is wrong");
        return;
    }
    if (characteristicChangedValue.length == 6) {
        return;
    }

    let stateID = characteristicChangedValue[2];
    let off = stateID & 0x0F;

    if (characteristicChangedValue[2] != new Buffer([0xf0])) {
        packageACKlower(new Buffer([0xA0 + off]), new Buffer([tempask + 2]));
    }
    unPackageData(characteristicChangedValue);
}

const packageACKlower = (stateID, sequenceId)=> {
    let cks = 0;
    let commandSendTemp = new Buffer(6);
    commandSendTemp[0] = new Buffer([0xB0]);
    commandSendTemp[1] = new Buffer([0x03]);
    commandSendTemp[2] = stateID;
    commandSendTemp[3] = sequenceId;
    commandSendTemp[4] = mType;
    cks = commandSendTemp[2] + commandSendTemp[3] + commandSendTemp[4];
    commandSendTemp[5] = new Buffer([cks]);
    commandGueue.offer(commandSendTemp);
    //计算预期顺序ID
    let currentBag = new Buffer([stateID & 0x0f]);
    let expectedId = new Buffer([(sequenceId & 0xff) + currentBag * 2]);
    setSequenceId(expectedId);
    addSequenceId(2);
    if (!getSendStatus()) {
        setSendStatus(true);
        //if (isSupportOnCharacterWrite == NOT_SUPPORTCHARACTERWRITE) {
        //    sendTimer.schedule(sendTimerTask, 10);
        //} else {
        run();
        //}
    } else {
        console.log("getSendStatus is true");
    }

}

const checkCKS = (start, end, data)=> {
    let cks = data[end + 1] & 0xFF;
    let sum = 0;
    for (let i = start; i < end + 1; i++) {
        sum = sum + data[i] & 0xFF;
    }
    if (sum == cks) {
        return true;
    } else {
        return false;
    }
}


const run = ()=> {
    for (let j = 0; j < commandGueue.length; j++) {
        let dataarr = [];
        for (let i = 0; i < commandGueue[j].length; i++) {
            let tmp = commandGueue[j][i].toString(16);
            if (tmp.length == 1) {
                tmp = '0' + tmp;
            }
            dataarr[i] = tmp;
        }
        console.log(`num ${j} (${commandGueue.length}): ${dataarr.join(' ')}`);
    }

    //测试用
    //let list = [
    //    new Buffer
    //    ([
    //        0xb0,
    //        0x11,
    //        0x11,
    //        0x01,
    //        0xaa,
    //        0xfa,
    //        0x51,
    //        0x52,
    //        0x03,
    //        0x5e,
    //        0x63,
    //        0x49,
    //        0x3d,
    //        0x42,
    //        0x68,
    //        0x1e,
    //        0x08,
    //        0x45,
    //        0x54,
    //        0x0c
    //    ]),
    //    new Buffer
    //    ([
    //        0xb0,
    //        0x06,
    //        0x10,
    //        0x03,
    //        0xaa,
    //        0x24,
    //        0x58,
    //        0x09,
    //        0x42
    //    ])
    //];

    for (let i = 0; i < commandGueue.length; i++) {
        writeCharacteristics(writeCharacteristic, commandGueue[commandGueue.length - i - 1]);
    }

}
