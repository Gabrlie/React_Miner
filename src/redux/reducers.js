// 创建reducer的区域 用于仓库的操作和管理
import {combineReducers} from 'redux';
import {levelMap} from "./minerAction";

// 初始化扫雷数据
const initMinerData= {
    // 难度等级 0~3 0为初级 1为中级 2为高级 3为自定义
    difficulty:0,
    // 游戏状态 0为未开始 1为进行中 2为失败 3为胜利
    status:0,
    // 游戏开始时间
    startTime:0,
    // 游戏结束时间
    endTime:0,
    // 行数
    row:9,
    // 列数
    col:9,
    // 雷数
    mine:10,
    // 游戏雷区
    // 雷区存在几种状态 9为雷 0为无雷 1~8为周围雷数
    area:new Array(9).fill(0).map(() => new Array(9).fill(0)),
    // 游戏展示的雷区
    // 0为未展示 1为标记 2为爆炸 3为展示 4为显示空白格
    showArea:new Array(9).fill(0).map(() => new Array(9).fill(0)),
}

function miner_reducer(state=initMinerData,action) {
    // 获取游戏难度与其对应的雷区信息
    let mineData = {...state};
    switch (action.type){
        case 'start_miner':
            let map = { row: state.row, col: state.col, mine: state.mine };
            // 随机生成雷区
            /*
            *  随机算法逻辑
            *  1. 生成一个长度为 row * col 的数组，每个元素都为0
            *  2. 将数组前对应雷数的元素置为mine
            *  3. 使用洗牌算法打乱数组，额外添加条件，防止第一次点击就点到雷
            *  4. 将这个一维数组填入二维数组中
            */
            const mineArr = new Array(map.row * map.col).fill(0);
            mineArr.fill(9, 0, map.mine);
            let result = [],
                random;
            while(mineArr.length>0){
                random = Math.floor(Math.random() * mineArr.length);
                result.push(mineArr[random])
                mineArr.splice(random, 1)
            }
            // 将一维数组转换为二维数组
            let area = [];
            for (let i = 0; i < map.row; i++){
                area.push(result.slice(i * map.col, (i + 1) * map.col));
            }
            // 判断点击位置附近的9个位置是否有雷
            let flag = false;
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    if (area[action.data.clickRow+i][action.data.clickCol+j] === 9) {
                        flag = true;
                    }
                }
            }
            if (flag) {
                // 获取没有雷的位置并将其存放到一个数组中
                let noMine = [];
                for (let i = 0; i < map.row; i++){
                    for (let j = 0; j < map.col; j++){
                        if (area[i][j] === 0){
                            noMine.push([i, j]);
                        }
                    }
                }
                if (noMine.length > 0) {
                    if (noMine.length < 9) {
                        for (let i = 0; i < noMine.length; i++) {
                            if (noMine[i] === [action.data.clickRow, action.data.clickCol]){
                                // 存在该位置，则将其剔除并退出循环
                                noMine.splice(i, 1);
                                break;
                            }
                            if (i+1 === noMine.length){
                                // 不存在该位置，则随机选择一个没有雷的位置进行交换
                                let random = Math.floor(Math.random() * noMine.length);
                                area[noMine[random][0]][noMine[random][1]] = 9;
                                area[action.data.clickRow][action.data.clickCol] = 0;
                                break;
                            }
                        }
                    } else {
                        // 剔除点击位置附近3*3的区域，然后随机选择一个没有雷的位置进行交换
                        noMine = noMine.filter(([row, col]) => {
                            for (let j = -1; j <= 1; j++) {
                                for (let k = -1; k <= 1; k++) {
                                    // 越界检测
                                    if (row + j < 0 || row + j >= map.row || col + k < 0 || col + k >= map.col){
                                        return true;
                                    }
                                    if (row === action.data.clickRow + j && col === action.data.clickCol + k) {
                                        return false;
                                    }
                                }
                            }
                            return true;
                        });
                        for (let j = -1; j <= 1; j++) {
                            for (let k = -1; k <= 1; k++) {
                                // 越界检测
                                if (action.data.clickRow + j < 0 || action.data.clickRow + j >= map.row || action.data.clickCol + k < 0 || action.data.clickCol + k >= map.col){
                                    continue;
                                }
                                // 判断是否为雷，如果是雷则随机交换
                                if (area[action.data.clickRow + j][action.data.clickCol + k] === 9) {
                                    let random = Math.floor(Math.random() * noMine.length);
                                    area[noMine[random][0]][noMine[random][1]] = 9;
                                    // 从noMine中剔除该位置
                                    noMine.splice(random, 1);
                                    area[action.data.clickRow + j][action.data.clickCol + k] = 0;
                                }
                            }
                        }
                    }
                }
            }
            
            // 计算周围雷数
            for (let i = 0; i < map.row; i++){
                for (let j = 0; j < map.col; j++){
                    if (area[i][j] === 9){
                        continue;
                    }
                    let count = 0;
                    for (let m = -1; m <= 1; m++){
                        for (let n = -1; n <= 1; n++){
                            // 越界检测
                            if (i + m < 0 || i + m >= map.row || j + n < 0 || j + n >= map.col){
                                continue;
                            }
                            if (area[i + m][j + n] === 9){
                                count++;
                            }
                        }
                    }
                    area[i][j] = count;
                }
            }
            // 将信息写入
            mineData.showArea = new Array(mineData.row).fill(0).map(() => new Array(mineData.col).fill(0));
            mineData.area = area;
            mineData.status = 1;
            mineData.startTime = new Date().getTime();
            return mineData;
            
        case 'change_miner_difficulty':
            // 如果难度为0~2则修改难度并从levelMap获取雷区信息，如果为3则修改难度并修改雷区信息
            mineData.difficulty = action.data.difficulty;
            if (action.data.difficulty < 3){
                mineData.row = levelMap[action.data.difficulty].row;
                mineData.col = levelMap[action.data.difficulty].col;
                mineData.mine = levelMap[action.data.difficulty].mine;
            } else {
                mineData.row = action.data.row;
                mineData.col = action.data.col;
                mineData.mine = action.data.mine;
            }
            // 修改数组大小
            mineData.area = mineData.showArea = new Array(mineData.row).fill(0).map(() => new Array(mineData.col).fill(0));
            mineData.status = 0;
            return mineData;
            
        case "open_miner_grid":
            if (mineData.area[action.data.row][action.data.col] === 9 && action.data.isEnd!==1){
                mineData.showArea[action.data.row][action.data.col] = 2;
                mineData.status = 2;
            } else {
                mineData.showArea[action.data.row][action.data.col] = 3;
            }
            return mineData;
        
        case "flag_miner_grid":
            if (mineData.showArea[action.data.row][action.data.col] === 0){
                mineData.showArea[action.data.row][action.data.col] = 1;
                mineData.mine--;
            } else if (mineData.showArea[action.data.row][action.data.col] === 1){
                mineData.showArea[action.data.row][action.data.col] = 0;
                mineData.mine++;
            }
            return mineData;
            
        case "end_miner":
            if (action.data.state === 3){
                mineData.status = 3;
            } else {
                mineData.status = 2;
            }
            mineData.endTime = new Date().getTime();
            return mineData;
            
        case "change_showMiner":
            mineData.showArea[action.data.row][action.data.col] = action.data.show;
            return mineData;
            
        default:
            return mineData;
    }
}

//合并多个reducer
export default combineReducers({
    miner_reducer,
})