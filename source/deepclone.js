function deepClone(obj) {
    if(typeof obj === 'object') {
        //复杂数据类型
        var result = obj.constructor == Array? [] : {};
        for(let i in obj) {
            result[i] = typeof obj[i] == 'object'? deepClone(obj[i]): obj[i];
        }
    } else {
        //简单数据类型
        var result = obj;
    }
    return result
}