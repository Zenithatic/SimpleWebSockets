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
const roomUsers: Map<string, string[]> = new Map<string, string[]>()

io.on('connection', (socket: Socket) => {
    console.log(`User connected with ID: ${socket.id}`)

    socket.on('join-room', (user: string, currentRoom: string, roomToJoin: string, render: (msgs: Message[]) => void) => {
        if (currentRoom === roomToJoin || roomToJoin === "") {
            return
        }

        socket.leave(currentRoom)
        roomMessages.get(currentRoom)?.push({ sender: '', message: `${user} has left the room.` })
        io.to(currentRoom).emit('message', { sender: '', message: `${user} has left the room.` })
        roomUsers.get(currentRoom)?.splice(roomUsers.get(currentRoom)?.indexOf(user)!, 1)
        io.to(currentRoom).emit('user-join', roomUsers.get(currentRoom))

        if (roomMessages.get(roomToJoin) == undefined) {
            roomMessages.set(roomToJoin, [])
            roomMessages.get(roomToJoin)?.push({ sender: '', message: `${user} has joined the room.` })

            roomUsers.set(roomToJoin, [])
            roomUsers.get(roomToJoin)?.push(user)
        }
        else {
            roomMessages.get(roomToJoin)?.push({ sender: '', message: `${user} has joined the room.` })
            roomUsers.get(roomToJoin)?.push(user)
        }

        io.to(roomToJoin).emit('message', { sender: '', message: `${user} has joined the room.` })
        socket.join(roomToJoin)

        io.to(roomToJoin).emit('user-join', roomUsers.get(roomToJoin))

        render(roomMessages.get(roomToJoin)!)
    })

    socket.on('message', (msg: string, room: string) => {
        if (room === "") {
            return
        }
        else {
            roomMessages.get(room)?.push({ sender: socket.handshake.query.userID as string, message: msg })
            io.to(room).emit('message', { sender: socket.handshake.query.userID as string, message: msg })
        }
    })

    socket.on('disconnect', () => {
        console.log("thing")
        const user = socket.handshake.query.userID as string

        for (const [key, value] of roomUsers.entries()) {
            if (value.includes(user)) {
                roomMessages.get(key)?.push({ sender: '', message: `${user} has left the room.` })
                io.to(key).emit('message', { sender: '', message: `${user} has left the room.` })
                roomUsers.get(key)?.splice(roomUsers.get(key)?.indexOf(user)!, 1)
                io.to(key).emit('user-join', roomUsers.get(key))
                break
            }
        }
    })
})

server.listen(3000, () => {
    console.log('Server running on port 3000')
})