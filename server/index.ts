interface Message {
    sender: string
    message: string
}

import express from 'express'
import { createServer } from 'node:http'
import { Server, Socket } from 'socket.io'

const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type']
    }
})

const roomMessages: Map<string, Message[]> = new Map<string, Message[]>()

io.on('connection', (socket: Socket) => {
    console.log(`User connected with ID: ${socket.id}`)

    socket.on('join-room', (user: string, currentRoom: string, roomToJoin: string, render: (msgs: Message[]) => void) => {
        if (currentRoom === roomToJoin) {
            render(roomMessages.get(currentRoom)!)
            return
        }

        socket.leave(currentRoom)
        roomMessages.get(currentRoom)?.push({ sender: '', message: `${user} has left the room.` })
        io.to(currentRoom).emit('message', { sender: '', message: `${user} has left the room.` })

        if (roomMessages.get(roomToJoin) == undefined) {
            roomMessages.set(roomToJoin, [])
            roomMessages.get(roomToJoin)?.push({ sender: '', message: `${user} has joined the room.` })
        }
        else {
            roomMessages.get(roomToJoin)?.push({ sender: '', message: `${user} has joined the room.` })
        }
        io.to(roomToJoin).emit('message', { sender: '', message: `${user} has joined the room.` })
        socket.join(roomToJoin)
        render(roomMessages.get(roomToJoin)!)
    })

    socket.on('message', (msg: Message, room: string) => {
        roomMessages.get(room)?.push(msg)
        io.to(room).emit('message', msg)
    })
})


server.listen(3000, () => {
    console.log('Server running on port 3000')
})