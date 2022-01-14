import React, { Component } from 'react'
import Test from './test'
export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 0,
      visible: false
    }
  }
  componentDidCatch(){
    console.log('componentDidCatch')
  }
  componentDidMount(){
    console.log('componentDidMount')
  }
  componentWillUnmount(){
    console.log('componentWillUnmount')
  }
  componentDidUpdate(){
    console.log('componentDidUpdate')
  }
  shouldComponentUpdate(){
    console.log(5)
  }
  // static getDerivedStateFromProps(prev, next){
  //   console.log(prev,next,6)

  // }
  getSnapshotBeforeUpdate(){
    console.log('getSnapshotBeforeUpdate')
  }
  setCount = () =>{
    console.log(this.state.count)
    let {count} = this.state
    console.log(count+1)
    this.setState({count: count+1, visible:false})
  }
  render() {
    console.log('render')
    return (
      <React.Fragment>
        <button onClick={this.setCount}>+</button>
        <button onClick={()=>this.setState({visible:true})}>show</button>
        {this.state.count}
        {this.state.visible && <div>2333dddssss</div>}
      </React.Fragment>
    )
  }
}
