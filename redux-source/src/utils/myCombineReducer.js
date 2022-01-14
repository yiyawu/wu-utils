export default function combineReducer(reducers) {
    const reducerKeys = Object.keys(reducers);
    const finalReducers = {};
    for(let i =0; i< reducerKeys.length;i++){
        const key = reducerKeys[i];
        if(typeof reducers[key] === 'function') {
            finalReducers[key] = reducers[key]
        }
    }
    const finalReducerKeys = Object.keys(finalReducers)

    return function combination(state,action){
        let hasChanged = false
        const nextState = {}
        for(let i = 0; i < finalReducerKeys.length; i++) {
            const key = finalReducerKeys[i]
            const reducer = finalReducers[key]
            const previousStateForKey = state[key]
            const nextStateForKey = reducer(previousStateForKey, action)
            if(typeof nextStateForKey === 'undefined') {
                const actionType = action && action.type
                console.log(`actionType:${actionType}类型错误`)
            }
            nextState[key] = nextStateForKey
            hasChanged = hasChanged || nextStateForKey !== previousStateForKey
        }
        hasChanged = hasChanged || finalReducerKeys.length !==Object.keys(state).length
        return hasChanged ? nextState: state
    }
}