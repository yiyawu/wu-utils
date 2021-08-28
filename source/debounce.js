/**
 * 定义：触发时间后在n秒内函数只执行一次,如果在n秒内又触发了事件,则会重新计算函数执行时间
 * 实现思路
 * 1.创建标记存放定时器的返回值
 * 2.事件持续触发，那么就清楚定时器，定时器回调不会执行
 * 3.在定时器内部使用apply重新绑定this指向
 */
/**
 * 
 * @param {*} fn 
 * @param {*} wait 
 * @param {*} immediate 
 * 参数代表函数是否立即执行
 * true的情况下，函数先执行一次后在一定的间隔内再次触发
 * false情况下，函数在一定的间隔内执行，事件触发后的间隔内再执行
 * @returns 
 */
const debounce = (fn, wait,immediate) => {
    let timer = null;
    return function(...args) {
        if (timer) clearTimeout(timer); 
        if(immediate && !timer) fn.call(this, args);
        timer = setTimeout(()=>{
            fn.call(this, args);
        },wait);
    }
}