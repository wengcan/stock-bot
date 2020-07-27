import {data} from './data/';
let v = Object.keys(data);
let k = Object.values(data);

let tempNames = [];
let tempCodes = [];

function parseMsg(msg,  uppercase = false){
    let [names, codes] = parseCode(msg);
    codes = codes.map(code => {
        if (code.substr(0, 1) === '6') {
            return `${uppercase ? 'SH': 'sh'}${code}`;
        } else {
            return `${uppercase ? 'SZ': 'sz'}${code}`;
        }
    });
    return [names, codes];
}

function getCodeAndName(names, codes, current){
    let nameIndex = names.indexOf(current);
    if (nameIndex >= 0) {
        return {
            name:current,
            code: codes[nameIndex]
        }
    } else{
        return false;
    }
}

function parseCode(str) {
    let current = "";
    let names = [];
    let codes = [];
    for (var i = 0; i < str.length; i++) {
        for (var j = 3; j <= 4; j++) {
            current = str.substr(i, j);
            // try to get name & code from cache data
            let res = getCodeAndName(tempNames, tempCodes , current);
            // get name & code from full data 
            if(!res){
                res = getCodeAndName(v, k, current);
                // push data to cache
                if(res && !tempCodes.indexOf(res.code)){
                    tempNames.push(res.name);
                    tempCodes.push(res.code);
                }
            }
            if(res){
                names.push(res.name);
                codes.push(res.code);
                i += j;
                continue;
            }
        }
    }
    return [names, codes ];
}


export {parseMsg}