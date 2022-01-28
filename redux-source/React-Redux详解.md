# Redux详解

1. ## Redux介绍

   Redux 是 JavaScript 应用的状态容器，提供可预测的状态管理。

   在Redux中有3个原则

   - **单一数据源**

     **整个应用的` State`被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个` Stroe`中。**

   - **State 是只读的**

     **唯一改变` State` 的方法就是触发`Actions`，`Actions`是一个用于描述已发生事件的普通对象。**

   - **使用纯函数来执行修改**

     **为了描述` Actions`如何改变 State tree ，你需要编写 `Reducers`。**

   如下图所示，在Redux中，有一个全局状态存储器`Store`，只有`Actions`才能去进行修改`Store`中的数据，其更改数据这一过程，即`store.dispatch(action)`就是为`Reducers`。当`Actions`修改完`Store`中的数据后，`Store`会通知对应页面其数据发送改变。

   ![img](https://upload-images.jianshu.io/upload_images/1512918-7a49c1a5f8dd636b.png?imageMogr2/auto-orient/strip|imageView2/2/w/600/format/webp)

2. ## 如何在React中使用Redux

   `React中`使用的是`react-redux`这个三方包

   众所周知，`React`它是一个**单项数据流**，它的数据传递是通过父组件传递给子组件props实现的，但对于嵌套过深的子组件想要根据父组件的状态去进行对应联动不是很友好，所以Redux的理念是用一个公共的`State`去共享它们的数据状态，只有通过`Action`去触发(`dispatch`)对应的`Reducer`才能达到修改公共数据。

   #### 如何在项目中使用React-redux

   
