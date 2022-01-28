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

    /**
    *发出一个动作。这是触发状态变化的唯一方法。
    *
    *将使用`创建`存储`函数
    *当前状态树和给定的“操作”。它的返回值将
    *被认为是树的**下一个**状态，以及更改侦听器
    *将被通知。
    *
    *基本实现只支持普通对象操作。如果你想
    *发送一个承诺，一个可观察到的，一个砰砰声，或其他东西，你需要
    *将商店创建功能包装到相应的中间件中。对于
    *例如，请参阅“redux thunk”软件包的文档。甚至
    *中间件最终将使用这种方法分派普通对象操作。
    *
    *@param action一个简单的对象，表示“发生了什么变化”。它是
    *一个好主意是保持动作的连续性，这样你就可以记录和重播用户
    *会话，或使用时间旅行的“redux devtools”。一定要有行动
    *不是“未定义”的“type”属性。这是一个好主意
    *动作类型的字符串常量。
    *
    *@returns为方便起见，与您发送的动作对象相同。
    *
    *请注意，如果使用自定义中间件，它可能会将'dispatch（）'包装为
    *归还其他东西（例如，你可以等待的承诺）。

    */
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