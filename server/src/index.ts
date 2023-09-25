import express from "express";
import { apiPort, mongoUri } from "./consts";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRouter from "./rotuers/userRouter";
import auth from "./middleware/auth";
import chatsRouter from "./rotuers/chatsRouter";
import socketInit from "./sockets";
import cors from "cors";

async function main() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded());
  app.use(cookieParser());
  app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

  await mongoose.connect(mongoUri);

  // User.findByIdAndUpdate();

  console.log("Working");

  socketInit();

  // console.log("Hello");

  // await Chat.findByIdAndUpdate("641be323740e8b854ffa1216", {
  //   $push: {
  //     messages: new Message({
  //       user: "641ad038b82df55d4dda0891",
  //       content: "Hello, World!",
  //     }),
  //   },
  // });

  app.get("/", (_, res) => {
    res.status(200).json({
      message: "Root Path Working successfully.",
    });
  });

  app.use("/users", userRouter);

  app.use("/chats", auth, chatsRouter);

  app.listen(apiPort, () => console.log(`Server started on port ${apiPort}`));
}

main().then(() => console.log("hell"));
