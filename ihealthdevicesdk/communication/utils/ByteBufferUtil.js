/**
 * Created by Fwind on 2017/1/3.
 */
export const bytesCuttForProductProtocol=(start,data)=>{
    let len = data.length - start - 1;
    let dataR = new Buffer(len);
    for (let i = 0; i < dataR.length; i++) {
        dataR[i] = data[i + start];
    }
    return dataR;
}

export const Bytes2HexString=(b)=> {
    let ret = "";
    for (let i = 0; i < b.length; i++) {
        let hex = (b[i]).toString(16);
        if (hex.size === 1) {
            hex = '0' + hex;
        }
        ret += hex.toUpperCase();
    }
    return ret;
}