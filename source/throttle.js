/**
 * 节流  原理: 规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发
 * 多次函数只有一次生效。
 */

/**
 * 
 * @param {*} func 
 * @param {*} wait 
 * @param {*} type 
 * 1为时间戳版，函数立即执行，按间隔执行
 * 2为定时器版，在事件触发的过程中，函数会立即执行，按间隔执行
 * @returns 
 */
function throttle(func, wait, type) {
    if(type === 1) let prev = 0;
    let timer;
    return function (...args) {
        if(type === 1 )  {
            let now = Date.now();
            if(now-prev > wait) func.apply(this, args),prev=now;
        } else {
            if(!timer) { 
                timer = setTimeout(() => {
                    timer = null;
                    func.apply(this,args)
                }, wait);
            }
        }
    }
}
//