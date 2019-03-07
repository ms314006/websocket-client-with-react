import React, { useState, useEffect } from 'react'
import ReactDom from 'react-dom'
import webSocket from 'socket.io-client'

const Main = () => {
    const [ws, setWs] = useState(null)

    const connectWebSocket = () => {
        setWs(webSocket('http://localhost:3000'))
    }

    useEffect(() => {
        if (ws) {
            console.log('success connect!')
            initWebSocket()
        }
    }, [ws])

    const initWebSocket = () => {
        //對 getMessage 設定監聽，如果 server 有透過 getMessage 傳送訊息，將會在此被捕捉
        ws.on('getMessage', message => {
            console.log(message)
        })
        ws.on('getMessageAll', message => {
            console.log(message)
        })
        ws.on('getMessageLess', message => {
            console.log(message)
        })
        ws.on('addRoom', message => {
            console.log(message)
        })
    }

    const sendMessage = (name) => {
        ws.emit(name, '收到訊息囉！')
    }

    const changeRoom = (event) => {
        let room = event.target.value
        if(room !== ''){
            ws.emit('addRoom', room)
        }
    }

    return (
        <div>
            <select onChange={changeRoom}>
                <option value=''>請選擇房間</option>
                <option value='room1'>房間一</option>
                <option value='room2'>房間二</option>
            </select>
            {/*其餘省略*/}
            <input type='button' value='連線' onClick={connectWebSocket} />
            <input type='button' value='送出訊息，只有自己收到回傳' onClick={() => { sendMessage('getMessage') }} />
            <input type='button' value='送出訊息，讓所有人收到回傳' onClick={() => { sendMessage('getMessageAll') }} />
            <input type='button' value='送出訊息，除了自己外所有人收到回傳' onClick={() => { sendMessage('getMessageLess') }} />
        </div>
    )
}

ReactDom.render(<Main />, document.getElementById('root'))