"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const consts_1 = require("./consts");
const Chat_1 = require("./models/Chat");
const Message_1 = __importDefault(require("./models/Message"));
const cors_1 = __importDefault(require("cors"));
function socketInit() {
    const socketServer = (0, express_1.default)();
    socketServer.use((0, cors_1.default)());
    const server = (0, http_1.createServer)(socketServer);
    const io = new socket_io_1.Server(server, { cors: { origin: "*" } });
    io.on("connection", (socket) => {
        console.log(`Client joined, socket address :: ${socket.id}`);
        socket.on("open-chat", ({ chatId }) => {
            // console.log(params);
            console.log("Chat Opened: ", chatId);
            socket.join(chatId);
        });
        socket.on("leave-chat", () => {
            console.log("Leaving Chats :: ", socket.rooms);
            socket.rooms.forEach((room) => socket.leave(room));
        });
        socket.on("message", ({ userId, chatId, content }) => __awaiter(this, void 0, void 0, function* () {
            const chat = yield Chat_1.Chat.findById(chatId);
            if (!chat) {
                socket.emit("error", "the chat does not exist.");
            }
            else {
                // chat.users.forEach()
                const message = new Message_1.default({
                    user: userId,
                    content,
                });
                yield Chat_1.Chat.findByIdAndUpdate(chatId, {
                    $push: {
                        messages: message,
                    },
                });
                io.to(chatId).emit("message", {
                    chatId,
                    message: yield message.populate("user"),
                });
            }
        }));
        socket.on("close", ({ chatId }) => {
            socket.leave(chatId);
            io.emit("close");
        });
    });
    server.listen(consts_1.socketPort, () => console.log(`SocketServer running on http://localhost:${consts_1.socketPort}`));
}
exports.default = socketInit;
