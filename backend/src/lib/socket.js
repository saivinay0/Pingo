import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    }
})
export function getreceiverSocketId(userId) {
    return userSocketmap[userId];
}
const userSocketmap = {};
io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketmap[userId] = socket.id;
    }
    io.emit("getOnlineUsers", Object.keys(userSocketmap));
    socket.on('disconnect', () => {
        console.log('user disconnected');
        delete userSocketmap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketmap));
    });
});
export { io, server, app };