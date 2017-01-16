/**
 * Created by Fwind on 2016/12/28.
 */
const DELTA = 0x9e3779b9;

const encryptInPlace = (data, key)=> {
    const promise=new Promise(function(resolve,reject){
        if (key.size() != 4) {
            console.log("XXTEA needs a 128-bits key");
        }
        if (data.size() < 2) {
            return data;
        }
        let n = data.size(),
            p,
            rounds = 6 + 52 / data.size(),
            e,
            y,
            sum = 0;
        let z = data.get(n - 1);
        do {
            sum += DELTA;
            e = (sum >>> 2) & 3;
            for (p = 0; p < n - 1; p++) {
                y = data.get(p + 1);
                z = data.get(p) + (((z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4)) ^ ((sum ^ y) + (key.get((p & 3) ^ e) ^ z)));
                data.put(p, z);
            }
            y = data.get(0);
            z = data.get(n - 1) + (((z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4)) ^ ((sum ^ y) + (key.get((p & 3) ^ e) ^ z)));
            data.put(p, z);
        } while (--rounds > 0);
        resolve(data);
    })
    return promise;

}

export const encrypt=(data,key)=>{
    const promise =new Promise(function(resolve,reject){
        let copy = new Buffer([data.size() - data.position()]);
        data.get(copy);
        encryptInPlace(data, key).then((req)=>{
            resolve(req);
        });
    })
    return promise;
}