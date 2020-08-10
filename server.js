const express = require('express');
const app = express()
const server = require('http').Server(app)
const socket = require('socket.io')(server);


// let rooms = new Map
let rooms = { '1': { 'users': [{ '1': '52352' }, { '3': '5274352' }, { '2': '5232352' }], 'messages': [] }, '2': { 'users': [{ '1': '52352' }, { '3': '5274352' }, { '2': '5232352' }], 'messages': [] } }
let roomID

socket.on('connection', (io) => {
    // let roomID
    io.on('JOIN', (data) => {
        roomID = data.id
        io.join(data.id)
        const roomObject = data
        if (rooms.hasOwnProperty(roomObject.id)) {
            // let users = Array.from(rooms[roomObject.id].users)
            let users = Array.from(rooms[roomObject.id].users)
            let userObject = {}
            userObject[io.id] = roomObject.username
            users[users.length] = userObject
            rooms[roomObject.id].users = users

        } else {
            let users = []
            let userObject = {}
            userObject[io.id] = roomObject.username
            users.push(userObject)
            let messages = []
            rooms[roomObject.id] = { users, messages }
            rooms[roomObject.id].users = users
        }
        const currentRoomUsers = rooms[roomObject.id].users
        io.to(roomObject.id).broadcast.emit('USERS', currentRoomUsers)
    })

    io.on('POST_MESSAGE', (data) => {
        console.log(data)
        const roomID = data.id
        const username = data.username
        const message = data.message
        const date = data.date
        
        const messageObject = {username, message, date}


        let messages = rooms[roomID].messages.push(messageObject)

        io.to(roomID).emit('MESSAGES', messageObject)
    })

    io.on('disconnect', (data) => {
        let roomID
        let users = []
        console.log('id: ', Object.keys(rooms))
        Object.keys(rooms).forEach((room) => {
            rooms[room].users.forEach((user) => {
                if (Object.keys(user) == io.id) {
                    roomID = room;
                    users = rooms[roomID]['users']
                    users.forEach((user, index) => {
                        if (Object.keys(user)[0] == io.id) {
                            rooms[roomID]['users'].splice(index, 1);
                        }
                    });
                }
            })
        })
        try {

            io.to(roomID).broadcast.emit('USERS', rooms[roomID]['users'])
        } catch (error) {

        }


    })
})

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.json())

app.get('/rooms/:id', (req, res) => {
    roomId = req.params.id
    console.log(roomId)
    if (rooms[roomId]) {
        res.send(rooms[roomId])
    } else {
        res.send('New room')
    }

});
app.get('/rooms', (req, res) => {

    res.send(rooms)
});

app.post('/rooms', (req, res) => {
    res.json()
});

app.post('/auth', (req, res) => {
    console.log('result:', req.body)
    res.send()
});

server.listen(5050, (error) => {
    if (error) {
        throw Error(error)
    }
    console.log('Сервер запущен')
})