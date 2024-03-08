//用于创建action的函数 actionCreater 创建action的函数
export const add=(data)=>{
    return {
        type:'add_goods',
        data:data
    }
}

export const del=(id) => {
    return {
        type:'del_goods',
        data:id
    }
}

export const upd=(data) => {
    return {type:'upd_goods',data:data}
}