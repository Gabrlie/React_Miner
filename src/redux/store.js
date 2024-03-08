// 引入redux以及创建数据仓库的方法
import {createStore} from 'redux'

import allReducers from "./reducers";

const store = createStore(allReducers);

export default store;
