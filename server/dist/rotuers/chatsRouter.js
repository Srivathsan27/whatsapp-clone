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
const consts_1 = require("../consts");
const Chat_1 = require("../models/Chat");
const User_1 = __importDefault(require("../models/User"));
const chatsRouter = express_1.default.Router();
chatsRouter.get("/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = yield Chat_1.Chat.findById(req.query.chatId)
        .populate("messages messages.user")
        .exec();
    if (!chat) {
        res.send(404).json({
            status: "error",
            type: consts_1.ErrorTypes.NOT_FOUND,
            message: "Chat not Found!",
        });
    }
    else {
        res.status(200).json(chat);
    }
}));
chatsRouter.post("/new", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = new Chat_1.Chat({
        users: req.body.users,
        name: req.body.name,
    });
    const saved = yield chat.save();
    // req.body.users.forEach(async (user: string) => {
    //   await User.findByIdAndUpdate(user, { $push: { chats: saved._id } });
    // });
    yield User_1.default.updateMany({ _id: { $in: req.body.users } }, { $push: { chats: saved._id } });
    res.status(200).json({
        status: "success",
        _id: saved._id,
        name: saved.name,
    });
}));
chatsRouter.delete("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.chatIds.forEach((_id) => __awaiter(void 0, void 0, void 0, function* () { return yield Chat_1.Chat.findByIdAndDelete(_id); }));
}));
chatsRouter.delete("/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleted = yield Chat_1.Chat.findByIdAndDelete(req.body.chatId);
    deleted === null || deleted === void 0 ? void 0 : deleted.users.forEach((userId) => __awaiter(void 0, void 0, void 0, function* () {
        yield User_1.default.findByIdAndUpdate(userId, { $pull: { chats: deleted._id } });
    }));
    res.status(200).json({
        status: "success",
        deleted: deleted === null || deleted === void 0 ? void 0 : deleted._id,
    });
}));
exports.default = chatsRouter;
