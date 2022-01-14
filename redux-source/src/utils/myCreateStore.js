import $$observable from './symbol/symbol-observable'
import ActionTypes from './symbol/actionTypes'

// export default function createStore(reducer, enhancer)
// export default function createStore(reducer,preloadedState,enhancer)
export default function createStore(reducer,preloadedState,enhancer){
    if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
        enhancer = preloadedState
        preloadedState = undefined
    }
    
    if(typeof enhancer !=='undefined'){
        return enhancer(createStore)(reducer, preloadedState)
    }
    let currentReducer = reducer
    let currentState = preloadedState
    let currentListeners = []
    let nextListeners = currentListeners
    let isDispatching = false
    /**
     * 浅拷贝一个当前监听器以便于我们在dispatching中使用将下一个监听器作为临时链表
     * 这防止了我们用户在调度过程中调用订阅/取消订阅的错误
     * 
     */
    function ensureCanMutateNextListeners() {
        if(nextListeners === currentListeners) {
            nextListeners = currentListeners.slice()
        }
    }
    /**
     * 读取当前被store管理的状态树
     * @returns 当前应用中的状态树
     */
    function getState(){
        return currentState
    }
    /**
     * 添加一些更改监听器，它会在一个dispatch被触发的时候被调用
     * 又或者是状态树的某些部分被更改的时候被调用
     * 您可以从更改监听器调用'dispatch（）'，方法如下
     * 1.订阅是在每次'dispatch（）'调用之前进行索引的创建
     * 如果在调用侦听器时订阅或取消订阅，这将不会对当前正在进行的'dispatch（）'产生任何影响。
     * 但是，下一个'dispatch（）'调用（无论是否嵌套）将使用订阅列表的最新索引值。
     * 
     * 2.侦听器不应期望看到所有状态更改，因为在调用侦听器之前，在嵌套的'dispatch（）'期间，状态可能已被更新多次。
     * 但是，可以保证在“dispatch（）”启动之前注册的所有订户在退出时都将以最新状态调用
     * @param {*} listener 每次分派时调用的回调。
     * @returns 一个移除这些更改监听器的函数
     */
    function subscribe(listener){
        let isSubscribed = true
        ensureCanMutateNextListeners()
        nextListeners.push(listener)
        return function unsubscribe(){
            if(!isSubscribed) return
            isSubscribed = false
            ensureCanMutateNextListeners()
            const index = nextListeners.indexOf(listener)
        }
    }

    //唯一修改状态树的方法
    function dispatch(action) {
        try{
            isDispatching = true
            currentState = currentReducer(currentState, action)
        } finally {
            isDispatching = false
        }
        const listener = (currentListeners = nextListeners)
        for(let i = 0; i < listener.length; i++) {
            const listener = listener[i]
            listener()
        }
        return action
    }
    function replaceReducer(nextReducer){
        ;(currentReducer) = nextReducer
        dispatch({type: ActionTypes.REPLACE})
        return store
    }
    function observable() {
        const outerSubscribe = subscribe
        return {
            subscribe(observer){
                function observeState() {
                    const observerAsObserver = observer
                    if(observerAsObserver.next){
                        observerAsObserver.next(getState())
                    }
                }
                observeState()
                const unsubscribe = outerSubscribe(observeState)
                return { unsubscribe }
            },
            [$$observable](){
                return this
            }
        }
    }
    const store = {
        dispatch,
        subscribe,
        getState,
        replaceReducer,
        [$$observable]: observable
    }
    return store
}