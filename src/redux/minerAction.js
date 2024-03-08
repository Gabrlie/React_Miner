// 扫雷难度对应表 0~2 3为自定义
export const levelMap = {
    0: { row: 9, col: 9, mine: 10 },
    1: { row: 16, col: 16, mine: 40 },
    2: { row: 16, col: 30, mine: 99 },
}

// 初始化图片
export function initImg() {
    // 包含三种表情的图片
    let face = [];
    face[0] = "data:img/gif;base64,R0lGODlhFQAVAJEAAAAAAP//AL29vQAAACH5BAAHAP8ALAAAAAAVABUAAAJAlI+py50AoUMwWCsduBy33XXAAoaiUlZY+nBq8MKUSY9HSbtzft4X/vu1MCLhcBXRoXgyBlD5AWYmgsiUis0yCgA7";
    face[1] = "data:img/gif;base64,R0lGODlhFQAVAJEAAAAAAP//AMDAwICAACH5BAAHAP8ALAAAAAAVABUAAAJHlI+py50AoUMwWCsduBy33XXAAoaiAkZqFYwUprZx+27xTR/swMoD/DKZXIaSkEMsXoytJQo58zyPOdIxSWJmJoIV9wueFAAAOw==";
    face[2] = "data:img/gif;base64,R0lGODlhFQAVAJEAAAAAAP//AMDAwAAAACH5BAAHAP8ALAAAAAAVABUAAAJDlI+py50AoUMwWCsduBy33XXAAm5gYHrPdWLs6p6parShSN36eNg6LbBFKhxejyV6wXwo4PGH+vyMDCKLqhlOttxuAQA7";
    // 表层格子图片以及炸弹图片
    let grid = [];
    for (let i = 0; i < 4; i++) {
        grid.push(new Image());
    }
    grid[0].src = "data:img/gif;base64,R0lGODlhGQAZAJEAAP///8DAwICAgAAAACH5BAQUAP8ALAAAAAAZABkAAAJKhI+pFrH/GpwnCFGb3nxfzHQi92XjWYbnmAIrepkvGauzV7s3Deq71vrhekJgrtgIIpVFptD5g+6kN+osZflot9xPsgvufsPkSwEAOw==";
    grid[1].src = "data:img/gif;base64,R0lGODlhGQAZAKIAAP///8DAwICAgP8AAAAAAAAAAAAAAAAAACH5BAAHAP8ALAAAAAAZABkAAANsCLrcriG8OSO9KwiRo//gt3FQaIJjZw7DmZYh25ovEMtzWH+47G6qno8GhAWEOVTRBur9SMxbUrQ8BQiEpyqE1RpBXSLUGtZVI9i0Wu3ZodfwbMR9ja/bZ6s3qjeTNCOBgoMjc4SHhIaIixsJADs=";
    grid[2].src = "data:img/gif;base64,R0lGODlhGQAZAJEAAP///4CAgP8AAAAAACH5BAQUAP8ALAAAAAAZABkAAAJgjI+py70Co5wUmhrHwPFyzVlBCIYeBGqqik6nkK4s7I6TjFOvCvR42bGhND3AbyPZEX2/GuwILV2iUZGEOgtesUhthuu8VcNbqE74fOZoSTQFiHm9u3G3OCSQ4yv6/aQAADs=";
    grid[3].src = "data:img/gif;base64,R0lGODlhGQAZAJEAAP///76+voKCggAAACH5BAAHAP8ALAAAAAAZABkAAAJglI+py70Bo5wUmhrHwPFyzVlCCIYeBGqqik5nkK4s7I6TjFOvCvR42bGhND3AbyPZEX2/GuwILV2iUZGEOgtesUhthuu8VcNbqE74fOZoSTQFiHm9u3G3OBSQ4yv6/aQAADs=";
    // 计时器图片
    let time = [];
    time[0] = "data:img/gif;base64,R0lGODlhDQAXAJEAAP8AAIAAAAAAAAAAACH5BAQUAP8ALAAAAAANABcAAAI5lI8Jy3wgmoMRymoc0vqt/G1hB1JkZVKKaQSC60YI/NZPW8dpApZrqvKhfkIPkIi5jFANWUkS5CUKADs=";
    time[1] = "data:img/gif;base64,R0lGODlhDQAXAJEAAP8AAIAAAAAAAAAAACH5BAQUAP8ALAAAAAANABcAAAI3lI8psc33mDQAmilAdUnv1mkXeHhWuGGlOCpsxGXIpII0dYbjs358v0PlgDGiDfQKPj6cmkJRAAA7";
    time[2] = "data:img/gif;base64,R0lGODlhDQAXAJEAAP8AAIAAAAAAAAAAACH5BAQUAP8ALAAAAAANABcAAAI8lI8Jy3whmgMvNmsgRC4nSwmaslRkOHKl962QVIYgfFAwta3JBu6i0UHwgp6cztQT/jCSZWTmGN5kn08BADs=";
    time[3] = "data:img/gif;base64,R0lGODlhDQAXAJEAAP8AAIAAAAAAAAAAACH5BAQUAP8ALAAAAAANABcAAAI5lI8Jy3whmgMvNmsgRC4nSwmaslRkOHKl962QVIYgXMGUvJFebnRi6/qpcECU8OB7XYK2CNIm+3wKADs=";
    time[4] = "data:img/gif;base64,R0lGODlhDQAXAJEAAP8AAIAAAAAAAAAAACH5BAQUAP8ALAAAAAANABcAAAI8lI8psc0HDJsmCmDptdhCXIFIF3rlOYpkyplftXWgJ9cHU8+3skkNu0usNB/PA+gQin4a0YPyMEF/PF4BADs=";
    time[5] = "data:img/gif;base64,R0lGODlhDQAXAJEAAP8AAIAAAAAAAAAAACH5BAQUAP8ALAAAAAANABcAAAI5lI8Jy3wgmgtmxSZotYhql2gX1GUbWZ6heSWGCEkWLHNmHR0iwnmKvVOZgiAWr2cU3jBIHKpmc7kKADs=";
    time[6] = "data:img/gif;base64,R0lGODlhDQAXAJEAAP8AAIAAAAAAAAAAACH5BAQUAP8ALAAAAAANABcAAAI5lI8Jy3wgmgtmxSZotYhql2gX1GUbWZ6heSWGCEkWLHPRiJE2woFPvxupeEDU0HeM5XQ4B6oWdCEKADs=";
    time[7] = "data:img/gif;base64,R0lGODlhDQAXAJEAAP8AAIAAAAAAAAAAACH5BAQUAP8ALAAAAAANABcAAAI5lI8Jy3whmgMvNmsgRC4nSwmaslRkOHKl963buIUejLziHZnkfOpHl/qtcCoU0dDBpVy8WO0W/EgLADs=";
    time[8] = "data:img/gif;base64,R0lGODlhDQAXAIAAAP8AAAAAACH5BAQUAP8ALAAAAAANABcAAAI0jI8Jy3wQmoMRymoc0vqt/G1hB1JkZVKKiTaRJ4VvbIGJja6pWvbirvPBbJdRawKL3ZaGAgA7";
    time[9] = "data:img/gif;base64,R0lGODlhDQAXAJEAAP8AAIAAAAAAAAAAACH5BAQUAP8ALAAAAAANABcAAAI6lI8Jy3wgmoMRymoc0vqt/G1hB1JkZVKKiTaRJ4VC0E4HnWDzLqp4b6D9SrecRrjy1XS0mAUWy0kNBQA7";
    // 底层格子9种数字图片
    let number = [];
    for (let i = 0; i < 9; i++) {
        number.push(new Image());
    }
    number[0].src = "data:img/gif;base64,R0lGODlhGQAZAKIAAM7OzsbGxr6+vra2trKysqampoKCggAAACH5BAAHAP8ALAAAAAAZABkAAANHaLrc3mWQSau9xAwQuv9gGBhEIJxoqq4CabLw6sY0Otf0jcP6Lpc+HjD4exFTvWNrqDwlj09iNDj1VXdXXLa2zTGb3VgYlgAAOw==";
    number[1].src = "data:img/gif;base64,R0lGODlhGQAZAJEAAMDAwICAgAAA/wAAACH5BAQUAP8ALAAAAAAZABkAAAJMjI+py70Ao5wUmorxzTxuLIRC9lFiSAbZOWqqybZVCcWoC8fpeu5gj/uJfBUWMXebvYpAJdJGoQFsTc8yQh1OpJ3otesEH8XbLzlSAAA7";
    number[2].src = "data:img/gif;base64,R0lGODlhGQAZALMAAMDAwKu5q6i4qKW3pZy0nJaylpCwkIquioCAgACAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAHAP8ALAAAAAAZABkAAAReEMlJq704X8C7/yAnhSQ5lmh3cknrvi64wvT7zXV9I50N+ipeihXzrFACoEhYMtB2pSSsIGN6CrRBIHQEEGjb0pEmGOJch+Gyl3samW13kB0vztViKx665+r7a4AfEQA7";
    number[3].src = "data:img/gif;base64,R0lGODlhGQAZAJEAAMDAwICAgP8AAAAAACH5BAQUAP8ALAAAAAAZABkAAAJOjI+py70Ao5wUmorxzTxuIITiOFIfiZbSmabT16le0EWyRdeg+OZTGzL5JECBsFI86m4AGIfpzEB9RVLPVuWtqFnjVZeJgmdjzbBMRk8KADs=";
    number[4].src = "data:img/gif;base64,R0lGODlhGQAZAJEAAMDAwICAgAAAmQAAgCH5BAAHAP8ALAAAAAAZABkAAAJdjI+py70Ao5wUmorxzTzuOgjAQJLUN5FiaU5oVK7sGVAxxA50Gor47KrBVJLc7hfilY6jnHMp+TynwYjgisXmfB4hx1jtgKPezLjbaULJ6bOlnK684mG6HG5H5ykFADs=";
    number[5].src = "data:img/gif;base64,R0lGODlhGQAZAJEAAMDAwICAgIAAAAAAACH5BAQUAP8ALAAAAAAZABkAAAJOjI+py70Ao5wUmorxzTxuIITiSE4fiY5mEKXu2oodDKmzx9bybeWgW6L9gDZcjLgz3oo9HhPw6TxPyGRTVxUIs1ohjxL9SsLia3nsO0MKADs=";
    number[6].src = "data:img/gif;base64,R0lGODlhGQAZAJEAAMDAwICAgACAgAAAACH5BAQUAP8ALAAAAAAZABkAAAJTjI+py70Ao5wUmorxzTxuKITiKFIfiZbTmaJmEI3dCoPqbNWAjOdxS3r9gDyPjhiUsEKVos/GpDgBS0Hz9twhsdTjNmqUfIU9ja5MQ1c+6nBbUgAAOw==";
    number[7].src = "data:img/gif;base64,R0lGODlhGQAZAJEAAL6+voKCggAAAAAAACH5BAAHAP8ALAAAAAAZABkAAAJMjI+py70Ao5wUmorxzTxuIITiSE4fiY5mEKXu2rUiHIOz9HElznY771NRcpQfrWI8TpJK2S1DtD2hPWeoRhTGojVgV1P9NsWWMBlSAAA7";
    number[8].src = "data:img/gif;base64,R0lGODlhGQAZAIAAAMDAwICAgCH5BAQUAP8ALAAAAAAZABkAAAJKjI+py70Ao5wUmorxzTxu63xeMIYi8JnHlK4UwpLgOctjaUuwnqtvb/rxQsJaZXcz/k4tGsqVfPp4OCK1yih2OM7t1avJgWNjTAEAOw==";
    return {face, grid, time, number}
}

export const start_miner=(data)=>{
    return {
        type:'start_miner',
        data:data
    }
}

export const change_miner_difficulty=(data)=>{
    return {
        type:'change_miner_difficulty',
        data:data
    }
}

export const open_miner_grid=(data)=>{
    return {
        type:'open_miner_grid',
        data:data
    }
}

export const flag_miner_grid=(data)=>{
    return {
        type:'flag_miner_grid',
        data:data
    }
}

export const end_miner=(data)=>{
    return {
        type:'end_miner',
        data:data
    }
}

export const change_showMiner=(data)=>{
    return {
        type:'change_showMiner',
        data:data
    }
}