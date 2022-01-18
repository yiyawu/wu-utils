class EventLisenner {
    constructor(){
        this.event = {}
    }
    //订阅，定义一个缓存列表用于存储订阅事件
    on(eventName,callback){
        if(!this.event[eventName]) {
            this.event[eventName] = []
        }
        //如果存在就让往数组中push一个子项
        this.event[eventName].push(callback);
        
    }
    //删除订阅
    off(eventName, callback){
        //不存在就返回
        if(!this.event[eventName]) return;
        //存在的话就匹配与之对应的子项并剔除
        this.event[eventName] = this.event[eventName].filter(item => item !== callback);
    }
    //只执行一次的订阅
    once(eventName, callback){
        //使用闭包的方式先触发一次订阅后，再删除订阅
        function fn() {
            callback();
            this.off(eventName, fn);
        }
        this.on(eventName,fn)
    }
    //触发事件
    emit(eventName, ...args){
        //存在就更改子项的this指向
        this.event[eventName] && this.event[eventName].forEach(fn => fn.apply(this,args));
    }
}
// 使用如下
// const events = new EventLisenner();

// const handle = (rest) => {
//   console.log(rest);
// };

// events.on("click", handle);

// event.emit("click", 1, 2, 3, 4);

// event.off("click", handle);

// events.emit("click", '1, 2');

// events.once("dbClick", () => {
//   console.log(123456);
// });
// events.emit("dbClick");
// events.emit("dbClick");
// events.emit("click",'dasdasd');