function bindActionCreator(actionCreators, dispatch){
    return function (this, ...args){
        return dispatch(actionCreators.apply(this, args))
    }
}
export default function bindActionCreators(actionCreators, dispatch){
    if(typeof actionCreators === 'function') {
        return bindActionCreator(actionCreators, dispatch)
    }
    const boundActionCreators = {}
    for(const key in actionCreators) {
        const actionCreator = actionCreators[key]
        if(typeof actionCreator === 'function') {
            boundActionCreators[key] = bindActionCreator(actionCreators,dispatch)
        }
    }
    return boundActionCreators
}