import express from "express";
import { ErrorTypes } from "../consts";
import { Chat } from "../models/Chat";
import User from "../models/User";
const chatsRouter = express.Router();

chatsRouter.get("/chat", async (req, res) => {
  const chat = await Chat.findById(req.query.chatId)
    .populate("messages messages.user")
    .exec();
  if (!chat) {
    res.send(404).json({
      status: "error",
      type: ErrorTypes.NOT_FOUND,
      message: "Chat not Found!",
    });
  } else {
    res.status(200).json(chat);
  }
});

chatsRouter.post("/new", async (req, res) => {
  const chat = new Chat({
    users: req.body.users,
    name: req.body.name,
  });

  const saved = await chat.save();

  // req.body.users.forEach(async (user: string) => {
  //   await User.findByIdAndUpdate(user, { $push: { chats: saved._id } });
  // });

  await User.updateMany(
    { _id: { $in: req.body.users } },
    { $push: { chats: saved._id } }
  );

  res.status(200).json({
    status: "success",
    _id: saved._id,
    name: saved.name,
  });
});

chatsRouter.delete("/", async (req, res) => {
  req.body.chatIds.forEach(
    async (_id: string) => await Chat.findByIdAndDelete(_id)
  );
});

chatsRouter.delete("/chat", async (req, res) => {
  const deleted = await Chat.findByIdAndDelete(req.body.chatId);
  deleted?.users.forEach(async (userId) => {
    await User.findByIdAndUpdate(userId, { $pull: { chats: deleted._id } });
  });
  res.status(200).json({
    status: "success",
    deleted: deleted?._id,
  });
});

export default chatsRouter;
