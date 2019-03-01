import React, { useState, useEffect } from 'react'
import ReactDom from 'react-dom'

const ConnectBlock = props => {

    const roomData = [{ id: 'room_1', name: '房間一' }, { id: 'room_2', name: '房間二' }]

    const getRoomName = () => {
        let targetIndex = roomData.findIndex(room => {
            return room.id === props.room
        })

        return roomData[targetIndex].name
    }

    let roomOption = roomData.map(room => {
        return <option value={room.id} key={room.id}>
            {room.name}
        </option>
    })

    return (
        <div>
            <select value={props.room}
                onChange={props.setRoom}
                disabled={props.socket ? true : false}>
                {roomOption}
            </select>
            <input type='button'
                value={props.socket ? '關閉 WebSocket 連結' : '連線至 WebSocket'}
                onClick={props.socket ? props.closeConnect : props.openConnect} />
            <span>{props.socket ? `已連線至${getRoomName()}` : '未連線'}</span>
        </div>
    )
}

const ControlButton = props => {
    return (
        <div>
            <input type='button' value='發送訊息給 server 後回傳 client' onClick={() => { props.sendMessage('onlyCatch') }} />
            <input type='button' value='發送訊息給 server 後回傳給所有連結的 client' onClick={() => { props.sendMessage('allCatch') }} />
            <input type='button' value='發送訊息給 server 後回傳給除了自己外所有連結的 client' onClick={() => { props.sendMessage('lessCatch') }} />
            <input type='button' value='發送訊息給 server 後回傳給相同房間的 client' onClick={() => { props.sendMessage('roomCatch') }} />
        </div>
    )
}


const Main = () => {
    const [message, setMessage] = useState('初始訊息')
    const [room, setRoom] = useState('room_1')
    const [socket, setSocket] = useState(null)

    const openConnect = () => {
        setSocket(require('socket.io-client')('http://localhost:3000'))
    }
    useEffect(() => {
        if (socket) {
            socketInit()
        }
    }, [socket])

    const closeConnect = () => {
        socket.close()
        setSocket(null)
    }

    const changeRoom = event => {
        setRoom(event.target.value)
    }

    const socketInit = () => {
        socket.on('getMessage', message => {
            setMessage(message)
        })

        socket.on('getMessageAll', message => {
            setMessage(message)
        })

        socket.on('getMessageLess', message => {
            setMessage(message)
        })

        socket.on('getMessageRoom', message => {
            setMessage(message)
        })

        sendMessage('setRoom')
    }

    const sendMessage = type => {
        switch (type) {
            case 'setRoom':
                socket.emit('setRoom', room)
                break
            case 'onlyCatch':
                socket.emit('getMessage', '只回傳給發送訊息的 client')
                break
            case 'allCatch':
                socket.emit('getMessageAll', '發送訊息後 server 回傳給所有連結的 client')
                break
            case 'lessCatch':
                socket.emit('getMessageLess', '發送訊息後 server 回傳給除了自己外所有連結的 client')
                break
            case 'roomCatch':
                socket.emit('getMessageRoom', '發送訊息後 server 回傳給相同房間的 client')
                break
        }
    }

    return (
        <div>
            <ConnectBlock room={room}
                setRoom={changeRoom}
                socket={socket}
                openConnect={openConnect}
                closeConnect={closeConnect} />
            <br />
            <span>{message}</span>
            <br /><br />
            <ControlButton sendMessage={sendMessage} />
        </div>
    )
}

ReactDom.render(<Main />, document.getElementById('root'))