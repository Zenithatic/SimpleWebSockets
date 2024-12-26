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
const roomUsers = new Map();
const users = [];
io.on('connection', (socket) => {
    console.log(`User connected with ID: ${socket.id}`);
    users.push(socket.handshake.query.userID);
    socket.on('join-room', (user, currentRoom, roomToJoin, render) => {
        var _a, _b, _c, _d, _e, _f, _g;
        if (currentRoom === roomToJoin || roomToJoin === "") {
            return;
        }
        socket.leave(currentRoom);
        (_a = roomMessages.get(currentRoom)) === null || _a === void 0 ? void 0 : _a.push({ sender: '', message: `${user} has left the room.` });
        io.to(currentRoom).emit('message', { sender: '', message: `${user} has left the room.` });
        (_b = roomUsers.get(currentRoom)) === null || _b === void 0 ? void 0 : _b.splice((_c = roomUsers.get(currentRoom)) === null || _c === void 0 ? void 0 : _c.indexOf(user), 1);
        io.to(currentRoom).emit('user-join', roomUsers.get(currentRoom));
        if (roomMessages.get(roomToJoin) == undefined) {
            roomMessages.set(roomToJoin, []);
            (_d = roomMessages.get(roomToJoin)) === null || _d === void 0 ? void 0 : _d.push({ sender: '', message: `${user} has joined the room.` });
            roomUsers.set(roomToJoin, []);
            (_e = roomUsers.get(roomToJoin)) === null || _e === void 0 ? void 0 : _e.push(user);
        }
        else {
            (_f = roomMessages.get(roomToJoin)) === null || _f === void 0 ? void 0 : _f.push({ sender: '', message: `${user} has joined the room.` });
            (_g = roomUsers.get(roomToJoin)) === null || _g === void 0 ? void 0 : _g.push(user);
        }
        io.to(roomToJoin).emit('message', { sender: '', message: `${user} has joined the room.` });
        socket.join(roomToJoin);
        io.to(roomToJoin).emit('user-join', roomUsers.get(roomToJoin));
        render(roomMessages.get(roomToJoin));
    });
    socket.on('message', (msg, room) => {
        var _a;
        if (room === "") {
            return;
        }
        else {
            (_a = roomMessages.get(room)) === null || _a === void 0 ? void 0 : _a.push({ sender: socket.handshake.query.userID, message: msg });
            io.to(room).emit('message', { sender: socket.handshake.query.userID, message: msg });
        }
    });
    socket.on('disconnect', () => {
        var _a, _b, _c;
        console.log("thing");
        const user = socket.handshake.query.userID;
        for (const [key, value] of roomUsers.entries()) {
            if (value.includes(user)) {
                (_a = roomMessages.get(key)) === null || _a === void 0 ? void 0 : _a.push({ sender: '', message: `${user} has left the room.` });
                io.to(key).emit('message', { sender: '', message: `${user} has left the room.` });
                (_b = roomUsers.get(key)) === null || _b === void 0 ? void 0 : _b.splice((_c = roomUsers.get(key)) === null || _c === void 0 ? void 0 : _c.indexOf(user), 1);
                io.to(key).emit('user-join', roomUsers.get(key));
                break;
            }
        }
    });
});
server.listen(3000, () => {
    console.log('Server running on port 3000');
});
