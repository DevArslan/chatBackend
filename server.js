const express = require('express');
const app = express()
const server = require('http').Server(app)
const socket = require('socket.io')(server);


// let rooms = new Map
let rooms = { '1': { 'users': [{ '1': '52352' }, { '3': '5274352' }, { '2': '5232352' }], 'messages': [] }, '2': { 'users': [{ '1': '52352' }, { '3': '5274352' }, { '2': '5232352' }], 'messages': [] } }

socket.on('connection', (io) => {
    let roomID
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
            rooms[roomObject.id] = {users,messages}
            rooms[roomObject.id].users = users
        }
        const currentRoomUsers = rooms[roomObject.id].users
        
        io.to(roomObject.id).emit('USER JOINED', currentRoomUsers)
    })

    io.on('disconnect',()=>{
        let users = []
        if(rooms[roomID] != undefined){
            users = rooms[roomID]['users']
            users.forEach((user, index) => {
                if(Object.keys(user)[0] == io.id){
                    users.splice(index, 1);
                }
            });
        }
        
    })
    
    console.log('user connected', io.id)
})

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.json())

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