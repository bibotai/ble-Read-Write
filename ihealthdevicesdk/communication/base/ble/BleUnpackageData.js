/**
 * Created by Fwind on 2016/12/30.
 */
import {bytesCuttForProductProtocol} from "../../utils/ByteBufferUtil"
import {haveNewData} from "../../ins/AaInsSet"

let NEW_PACKAGEDATA = 101;
let NEXT_PACKAGEDATA = 102;
let THIS_PACKAGEDATA = 103;

let mCommandId, sequenceIdBuffer;
let readBuffer = new Map();


const checkPackageRange = (sequenceId)=> {
    const promise = new Promise(function (resolve, reject) {
        let State = THIS_PACKAGEDATA;
        //console.log("getPackageData reject:"+reject);
        if (sequenceIdBuffer == null) {
            State = NEW_PACKAGEDATA;
        } else {
            sequenceIdBuffer.forEach(function (item, index) {
                //console.log("sequenceIdBuffer:" + item + "(" + index + ")" + sequenceId);
                if (item === sequenceId) {
                    State = THIS_PACKAGEDATA;
                }
                if (index === (sequenceId.length - 1)) {
                    State = NEXT_PACKAGEDATA;
                }
            })
        }
        resolve(State);
    })
    return promise;
}


const setSequenceIdBuffer = (allPackageNum, subPackageNum, sequenceId)=> {
    sequenceIdBuffer = new Array(parseInt(allPackageNum));
    sequenceIdBuffer[subPackageNum] = sequenceId;
    //console.log("sequenceIdBuffer"+allPackageNum+","+subPackageNum+","+sequenceId);
    let subPackageNumReverse = allPackageNum - subPackageNum - 1;
    for (let i = 0; i <= subPackageNumReverse; i++) {
        let temp = sequenceId - (subPackageNumReverse - i) * 2;
        if (temp < 0) {
            temp = 256 + temp;
        }
        sequenceIdBuffer[i] = temp;
    }
    for (let i = (subPackageNumReverse + 1); i < allPackageNum; i++) {
        let temp = sequenceId + (i - subPackageNumReverse) * 2;
        if (temp > 255) {
            temp = temp - 256;
        }
        sequenceIdBuffer[i] = temp;
    }
}

const resetSequenceIdBuffer = (allPackageNum, subPackageNum, sequenceId)=> {
    sequenceIdBuffer = new Array(parseInt(allPackageNum));
    setSequenceIdBuffer(allPackageNum, subPackageNum, sequenceId);
}

const finishPackageData = ()=> {
    let commandsum = 0;
    //console.log("finishPackageData:")
    readBuffer.forEach(function (item, index) {
        commandsum += item.length;
    })

    let command = new Buffer(commandsum);
    let index = 0;
    for (let i = 0; i < sequenceIdBuffer.length; i++) {
        let reqId = sequenceIdBuffer[i];
        let temp = readBuffer.get(reqId);
        for (let j = 0; j < temp.length; j++) {
            command[index] = temp[j];
            index += 1;
        }
    }
    haveNewData(mCommandId, 0, command).then((req)=>{
        console.log("haveNewData:"+req);
    });
};

const checkSequenceIdBuffer = (allPackageNum, subPackageNum, sequenceId, data)=> {
    //console.log("checkSequenceIdBuffer2:"+sequenceId+","+readBuffer.get(sequenceId));
    if (readBuffer.get(sequenceId) == null) {
        //console.log("checkSequenceIdBuffer3:"+readBuffer.size+","+allPackageNum);
        let temp;
        if ((allPackageNum - 1) == subPackageNum) {
            mCommandId = data[5] & 0xff;
            temp = bytesCuttForProductProtocol(6, data);
            readBuffer.set(sequenceId, temp);
        } else {
            temp = bytesCuttForProductProtocol(5, data);
            readBuffer.set(sequenceId, temp);
        }
        //console.log("checkSequenceIdBuffer4:" + readBuffer.size + "," + allPackageNum);
        if (readBuffer.size == allPackageNum) {
            finishPackageData();
        }
    }
}

export const unPackageData = (data)=> {
    const promise=new Promise(function(resolve,reject){
        let stateId = data[2] & 0xff;
        //console.log("unPackageData-init" + stateId + "," + data[2]);
        if (stateId === 0 || stateId === 0xf0) {
            //console.log("unPackageData-stateId=0：" + stateId);
            let commandId = data[5] & 0xff;
            let temp = bytesCuttForProductProtocol(6, data);
            haveNewData(commandId, 0, temp);
        } else if (stateId < 0xA0) {

            let allPackageNum = (stateId >> 4) + 1;
            //console.log("unPackageData-allPackageNum：" + allPackageNum);
            let subPackageNum = stateId & 0x0f;
            let sequenceId = data[3] & 0xff;

            checkPackageRange(sequenceId).then((packagedata)=> {
                //console.log("unPackageData-sequenceId：" + sequenceId + "," + packagedata);
                switch (packagedata) {
                    case NEXT_PACKAGEDATA:
                        mCommandId = 0;
                        readBuffer.clear();
                    case NEW_PACKAGEDATA:
                        resetSequenceIdBuffer(allPackageNum, subPackageNum, sequenceId);

                    case THIS_PACKAGEDATA:
                        //console.log("checkSequenceIdBuffer1：" + packagedata + "," + THIS_PACKAGEDATA);
                        checkSequenceIdBuffer(allPackageNum, subPackageNum, sequenceId, data);
                        break;
                    default:
                        break;
                }
            })
        }
        resolve("unPackageData ok");
    })
    return promise;


}
