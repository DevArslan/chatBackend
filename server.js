const express = require('express');
const app = express()
const server = require('http').Server(app)
const socket = require('socket.io')(server);







const rooms = new Map()

socket.on('connection', (socket) => {
    console.log('user connected',socket.id)
})

app.get('/rooms', (req,res)=>{
    res.json(rooms)
});

server.listen(5050,(error)=>{
    if(error){
        throw Error(error)
    }
    console.log('Сервер запущен')
})