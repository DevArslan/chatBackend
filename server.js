const express = require('express');
const app = express()
const server = require('http').Server(app)
const socket = require('socket.io')(server);







const rooms = new Map()

socket.on('connection', (socket) => {
    console.log('user connected',socket.id)
})

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/rooms', (req,res)=>{
    res.json(rooms)
});

app.post('/rooms', (req,res)=>{
    console.log(res)
    res.send()
});

server.listen(5050,(error)=>{
    if(error){
        throw Error(error)
    }
    console.log('Сервер запущен')
})