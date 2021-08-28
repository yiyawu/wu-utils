function my_instanceOf(leftValue, rightValue){
    let rightProto = rightValue.prototype; //取右边的显式原型
    leftValue = leftValue.__proto__; //取左边的隐式原型
    while(true) {
        if(leftValue === null){
            return false;
        }
        if(leftValue === rightProto){ //当右边严格等于左边时，返回true
            return true;
        }
        leftValue = leftValue.__proto__;
    }
}

