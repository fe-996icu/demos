import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

// saga监听的action
import rootSagas from './sagas.js'

// reducer
import reducer from './reducer/index.js'

// 创建saga中间件
const sagaMiddleware = createSagaMiddleware();

// 可能会有多个中间件
let middlewares = [];
middlewares.push(sagaMiddleware);

// redux应用中间件后返回一个createStore函数
const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

// const store = createStore(reducer);
// 创建store
const store = createStoreWithMiddleware(reducer);

// saga执行监听action
sagaMiddleware.run(rootSagas);

export default store;