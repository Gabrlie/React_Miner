// 网页扫雷主要展示页面
import React, {Component} from 'react';
import {connect} from "react-redux";
import {
    change_miner_difficulty,
    change_showMiner,
    end_miner,
    flag_miner_grid,
    initImg,
    open_miner_grid,
    start_miner
} from "../../redux/minerAction"
import {Sprite, Stage} from "@pixi/react";
import "./MinerView.less";
import {Dropdown, Space} from 'antd';

class MinerView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeFlag: null,
            gridFlag: null,
            costTime: 0,
            faceClass: 'face',
        }
    }
    
    // 图片资源
    img = initImg();
    
    // 下拉菜单
    items = [
        {
            key: '1',
            label: (
                <span>
                初级
            </span>
            ),
        },
        {
            key: '2',
            label: (
                <span>
                中级
            </span>
            ),
        },
        {
            key: '3',
            label: (
                <span>
                高级
            </span>
            ),
        },
        {
            key: 'diy',
            label: (
                <span>
                自定义...
            </span>
            ),
        },
        {
            type: 'divider',
        },
        {
            key: 'list',
            label: (
                <span>
                扫雷英雄榜
            </span>
            ),
        },
    ];
    
    
    // 计时器
    timer = () => {
        let timeFlag = setInterval(() => {
            // 每10ms检测一次是否结束
            this.isEnd();
            // 更新时间
            this.setState({
                costTime: new Date().getTime() - this.props.minerData.miner_reducer.startTime
            })
        }, 10)
        this.setState({
            timeFlag: timeFlag
        })
    }
    
    // 结束计时器
    killTimer = () => {
        // 由于计时器会存在不同步情况，需要延时1ms执行
        setTimeout(()=>{
            this.setState({costTime:0});
        },1)
        clearInterval(this.state.timeFlag);
    }
    
    // 错误标记
    wrongGridDisplay = (wrongGrid) => {
        let gridFlag = setInterval(()=>{
            wrongGrid.forEach((item)=>{
                this.changeShowMiner(item[0], item[1], this.props.minerData.miner_reducer.showArea[item[0]][item[1]] === 4 ? 1:4)
            })
        },1000);
        this.setState({
            gridFlag: gridFlag
        })
    }
    
    // 错误标记提示
    changeShowMiner = (row, col, show) => {
        this.props.change_showMiner({
            row:row,
            col:col,
            show:show
        })
    }
    
    // 结束错误标记计时器
    killGridFlag = () => {
        clearInterval(this.state.gridFlag);
    }

    // 初始化
    init = () => {
        let minerData = this.props.minerData.miner_reducer;
        this.props.change_miner_difficulty({
            difficulty:minerData.difficulty,
            row:minerData.row,
            col:minerData.col,
            mine:minerData.mine
        })
        this.killTimer();
        this.setState({
            costTime:0
        })
        this.killGridFlag();
    }
    
    // 第一次点击，初始化雷区
    start = async (row, col) => {
        await this.props.start_miner({
            // click为点击位置，防止第一次点击就点到雷
            clickRow: row,
            clickCol: col,
        });
        await this.openGrid(row, col);
        // 添加计时器用以循环更新
        await this.timer();
    }
    
    // 递归打开格子
    openGrid = (row, col) => {
        if (this.props.minerData.miner_reducer.showArea[row][col] !== 0) {
            return;
        }
        this.props.open_miner_grid({
            row:row,
            col:col
        });
        if (this.props.minerData.miner_reducer.area[row][col] === 0){
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    // 越界检测
                    if (row + i < 0 || row + i >= this.props.minerData.miner_reducer.row || col + j < 0 || col + j >= this.props.minerData.miner_reducer.col){
                        continue;
                    }
                    this.openGrid(row + i, col + j);
                }
            }
        }
    }
    
    // 修改难度
    changeDifficulty = (difficulty=0, row=9, col=9, mine=10) => {
        this.props.change_miner_difficulty({
            difficulty:difficulty,
            row:row,
            col:col,
            mine:mine
        })
        this.killTimer();
        this.setState({
            costTime:0
        })
        this.killGridFlag();
    }
    
    // 右键标记
    flagGrid = (row, col) => {
        this.props.flag_miner_grid({
            row:row,
            col:col
        })
    }
    
    // 点击事件
    clickGrid = (e) => {
        const rect = e.target.getBoundingClientRect();
        let row = Math.floor((e.clientY - rect.top) / 25);
        let col = Math.floor((e.clientX - rect.left) / 25);
        if (e.button === 0) {
            if (this.props.minerData.miner_reducer.status === 0) {
                this.start(row, col);
            } else if (this.props.minerData.miner_reducer.status === 1) {
                if (this.props.minerData.miner_reducer.showArea[row][col] === 0) {
                    this.openGrid(row, col);
                } else if (this.props.minerData.miner_reducer.showArea[row][col] === 1){
                    this.flagGrid(row, col);
                } else if (this.props.minerData.miner_reducer.showArea[row][col] === 3) {
                    // 已翻开的格子左键会获取周围没有打开的格子，如果雷数等于标记数则全部打开
                    let notOpen = [];    // 未打开的格子
                    let flag = 0;       // 标记数
                    for (let i = -1; i < 2; i++) {
                        for (let j = -1; j < 2; j++) {
                            if (row + i < 0 || row + i >= this.props.minerData.miner_reducer.row || col + j < 0 || col + j >= this.props.minerData.miner_reducer.col){
                                continue;
                            }
                            if (this.props.minerData.miner_reducer.showArea[row + i][col + j] === 1) {
                                flag++;
                            } else if (this.props.minerData.miner_reducer.showArea[row + i][col + j] === 0) {
                                notOpen.push([row + i, col + j]);
                            }
                        }
                    }
                    if (flag === this.props.minerData.miner_reducer.area[row][col]) {
                        notOpen.forEach((item)=>{
                            this.openGrid(item[0], item[1]);
                        })
                    } else {
                        // 不满足条件则给未打开格子翻开效果0.5s
                        // 给格子设置状态4
                        notOpen.forEach((item)=>{
                            this.props.minerData.miner_reducer.showArea[item[0]][item[1]] = 4;
                        })
                        // 0.1s后将状态4的格子还原
                        setTimeout(()=>{
                            notOpen.forEach((item)=>{
                                this.props.minerData.miner_reducer.showArea[item[0]][item[1]] = 0;
                            })
                        },100)
                    }
                }
            }
        } else if (e.button === 2) {
            e.preventDefault();
            if (this.props.minerData.miner_reducer.status === 1) {
                this.flagGrid(row, col);
            }
        }
        this.isEnd();
    }
    
    // 结束检测
    isEnd = () => {
        let grid = [];
        if (this.props.minerData.miner_reducer.status === 1) {
            // 判断格子是否全部打开 没打开的格子将其坐标存入grid
            for (let i = 0; i < this.props.minerData.miner_reducer.row; i++) {
                for (let j = 0; j < this.props.minerData.miner_reducer.col; j++) {
                    if (this.props.minerData.miner_reducer.showArea[i][j] === 0) {
                        grid.push([i, j]);
                    }
                }
            }
            // 如果剩余雷数等于grid则全部翻开并获胜
            if (grid.length === this.props.minerData.miner_reducer.mine) {
                let flag = true;
                // 遍历标记格子是否正确
                for (let i = 0; i < this.props.minerData.miner_reducer.row; i++) {
                    for (let j = 0; j < this.props.minerData.miner_reducer.col; j++) {
                        if (this.props.minerData.miner_reducer.showArea[i][j] === 1 && this.props.minerData.miner_reducer.area[i][j] !== 9) {
                            flag = false;
                        }
                    }
                }
                // 如果没有剩余格子则直接跳过检测
                if (grid !== []) {
                    grid.forEach((item)=>{
                        if (this.props.minerData.miner_reducer.area[item[0]][item[1]] !== 9) {
                            flag = false;
                        }
                    })
                }
                if (flag) {
                    for (let i = 0; i < grid.length; i++) {
                        this.flagGrid(grid[i][0], grid[i][1]);
                    }
                    this.props.end_miner({state:3});
                    clearInterval(this.state.timeFlag);
                }
            }
        } else if (this.props.minerData.miner_reducer.status === 2) {
            clearInterval(this.state.timeFlag);
            // 输了以后会自动翻开所有包含雷的格子以及检测是否有标记错误的格子，存在则闪烁提醒
            let wrongGrid = [];
            for (let i = 0; i < this.props.minerData.miner_reducer.row; i++) {
                for (let j = 0; j < this.props.minerData.miner_reducer.col; j++) {
                    if (this.props.minerData.miner_reducer.area[i][j] === 9 && this.props.minerData.miner_reducer.showArea[i][j] === 0) {
                        this.props.minerData.miner_reducer.showArea[i][j] = 3;
                    }
                    if (this.props.minerData.miner_reducer.showArea[i][j] === 1 && this.props.minerData.miner_reducer.area[i][j] !== 9) {
                        wrongGrid.push([i, j]);
                    }
                }
            }
            if (wrongGrid.length > 0) {
                this.wrongGridDisplay(wrongGrid);
            }
        } else {
            this.killTimer();
        }
    }
    
    componentDidMount() {
        // 去除右键菜单
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });
    }
    
    mouseUpListener = () => {
        document.addEventListener('mouseup', () => {
            this.setState({faceClass: 'face'});
        })
        this.init();
    }
    
    // 下拉菜单状态修改
    gameMenu = ({ key }) => {
        switch (key) {
            case '1':
            case '2':
            case '3':
                this.changeDifficulty(key - 1);
                break;
            case 'diy':
                console.log('diy')
                break;
            case 'list':
                console.log('list')
                break;
            default:
                break;
        }
    }
    
    render() {
        const minerData = this.props.minerData.miner_reducer;
        return (
            <div>
                <h1>扫雷</h1>
                <div className="miner" style={{width:(25 * minerData.col)}}>
                    <div className="topBar">
                        <Dropdown
                            menu={{
                                items: this.items,
                                onClick: this.gameMenu
                            }}
                            placement="bottomLeft"
                            trigger={['click']}
                        >
                            <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                    <span>游戏</span>
                                </Space>
                            </a>
                        </Dropdown>
                        <span>关于</span>
                        <span style={{float:"right"}}>
                            {
                                minerData.difficulty === 0 ? '简单' : minerData.difficulty === 1 ? '中等' : minerData.difficulty === 2 ? '困难' : '自定义'
                            }
                        </span>
                    </div>
                    <div className="menu border">
                        <div>
                            {
                                // 雷数显示，最多三位数，根据数字显示对应图片
                                String(Math.max(minerData.mine, 0)).padStart(3, '0').split('').map((item, index) => {
                                    return <img src={this.img.time[item]} key={index} alt=""/>
                                })
                            }
                        </div>
                        <div className={this.state.faceClass} onMouseDown={()=>{this.setState({faceClass: 'face-hover'});this.mouseUpListener()}}>
                            {
                                // 头像，用于显示游戏状态
                                minerData.status === 0 || minerData.status === 1 ? <img src={this.img.face[0]} onClick={()=>{this.init()}} alt="" /> : minerData.status === 3 ? <img src={this.img.face[1]} onClick={()=>{this.init()}} alt="" /> : <img src={this.img.face[2]} onClick={()=>{this.init()}} alt="" />
                            }
                        </div>
                        <div>
                            {
                                // 时间显示，最多三位数，根据数字显示对应图片
                                String(Math.floor(this.state.costTime / 1000)).padStart(3, '0').split('').map((item, index) => {
                                    return <img src={this.img.time[item]} key={index} alt=""/>
                                })
                            }
                        </div>
                    </div>
                    <Stage className={'minerPanel border'} width={25 * minerData.col} height={25 * minerData.row} options={{backgroundColor: 0xcccccc}}
                           onMouseDown={this.clickGrid}>
                        {
                            minerData.area.map((item, index) => {
                                return item.map((item2, index2) => {
                                    return <>
                                        <Sprite
                                            image={this.img.number[item2] ? this.img.number[item2] : this.img.grid[3]}
                                            x={index2 * 25} y={index * 25}/>
                                    </>
                                })
                            })
                        }
                        {
                            minerData.showArea.map((item, index) => {
                                return item.map((item2, index2) => {
                                    if (item2 !== 3) {
                                        if (item2 === 4) {
                                            return <>
                                                <Sprite image={this.img.number[0]} x={index2 * 25}
                                                        y={index * 25}/>
                                            </>
                                        } else {
                                            return <>
                                                <Sprite image={this.img.grid[item2]} x={index2 * 25}
                                                        y={index * 25}/>
                                            </>
                                        }
                                    } else {
                                        return <></>
                                    }
                                })
                            })
                        }
                    </Stage>
                </div>
            
            </div>
        );
    }
}

export default connect((store) => {
    return {
        minerData: store
    }
}, {
    start_miner, change_miner_difficulty, open_miner_grid, flag_miner_grid, end_miner, change_showMiner
})(MinerView);