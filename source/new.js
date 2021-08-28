/**
 * new操作符做哪些事
 * 1.创建一个全新的对象
 * 2.会被执行[[Prototype]](也就是__proto__)链接
 * 3.使this指向新创建的对象
 * 4.通过new创建的每个对象将最终被[[Prototype]]链接到这个函数的prototype对象上
 * 5.如果函数没有返回对象类型Object (包含Function,Array,Date,RegExg,Error),那么new
 * 表达式中的函数调用将返回该对象引用
 */
function my_new() {
    const obj = new Object();
    const Constructor = [].shift.call(arguments);
    obj.__proto__ = Constructor.prototype;
    const ret = Constructor.apply(obj, arguments);
    return typeof ret === 'object'? ret : obj;
}

//以下测试用例
function Test(name){
    this.name = name
}
Test.prototype.sayName = function(){
    console.log(this.name)
}
const a = my_new(Test,'yyy') 
a.sayName()
console.log(a)