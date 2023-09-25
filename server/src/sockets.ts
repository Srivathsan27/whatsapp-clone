import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { socketPort } from "./consts";
import { Chat } from "./models/Chat";
import Message from "./models/Message";
import cors from "cors";

function socketInit() {
  const socketServer = express();
  socketServer.use(cors());
  const server = createServer(socketServer);

  const io = new Server(server, { cors: { origin: "*" } });

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

    socket.on("message", async ({ userId, chatId, content }) => {
      const chat = await Chat.findById(chatId);

      if (!chat) {
        socket.emit("error", "the chat does not exist.");
      } else {
        // chat.users.forEach()

        const message = new Message({
          user: userId,
          content,
        });

        await Chat.findByIdAndUpdate(chatId, {
          $push: {
            messages: message,
          },
        });

        io.to(chatId).emit("message", {
          chatId,
          message: await message.populate("user"),
        });
      }
    });

    socket.on("close", ({ chatId }) => {
      socket.leave(chatId);
      io.emit("close");
    });

    io.emit("connection-ack");
  });

  server.listen(socketPort, () =>
    console.log(`SocketServer running on http://localhost:${socketPort}`)
  );
}

export default socketInit;
