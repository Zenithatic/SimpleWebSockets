"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = (0, node_http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type']
    }
});
const roomMessages = new Map();
io.on('connection', (socket) => {
    console.log(`User connected with ID: ${socket.id}`);
    socket.on('join-room', (user, currentRoom, roomToJoin, render) => {
        var _a, _b, _c;
        if (currentRoom === roomToJoin) {
            render(roomMessages.get(currentRoom));
            return;
        }
        socket.leave(currentRoom);
        (_a = roomMessages.get(currentRoom)) === null || _a === void 0 ? void 0 : _a.push({ sender: '', message: `${user} has left the room.` });
        io.to(currentRoom).emit('message', { sender: '', message: `${user} has left the room.` });
        if (roomMessages.get(roomToJoin) == undefined) {
            roomMessages.set(roomToJoin, []);
            (_b = roomMessages.get(roomToJoin)) === null || _b === void 0 ? void 0 : _b.push({ sender: '', message: `${user} has joined the room.` });
        }
        else {
            (_c = roomMessages.get(roomToJoin)) === null || _c === void 0 ? void 0 : _c.push({ sender: '', message: `${user} has joined the room.` });
        }
        io.to(roomToJoin).emit('message', { sender: '', message: `${user} has joined the room.` });
        socket.join(roomToJoin);
        render(roomMessages.get(roomToJoin));
    });
    socket.on('message', (msg, room) => {
        var _a;
        (_a = roomMessages.get(room)) === null || _a === void 0 ? void 0 : _a.push(msg);
        io.to(room).emit('message', msg);
    });
});
server.listen(3000, () => {
    console.log('Server running on port 3000');
});
