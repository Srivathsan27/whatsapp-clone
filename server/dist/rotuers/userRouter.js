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
const User_1 = __importDefault(require("../models/User"));
const argon2_1 = __importDefault(require("argon2"));
const userRouter = express_1.default.Router();
userRouter.post("/auth", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.cookies);
    if (req.cookies.user) {
        res.status(200).json({
            status: "success",
        });
    }
    else {
        const user = yield User_1.default.findOne({ email: req.body.email });
        if (!user) {
            res.status(400).json({
                status: "error",
                type: consts_1.ErrorTypes.INVALID,
                message: "User does not exist",
            });
        }
        else {
            if (yield argon2_1.default.verify(user.password, req.body.password)) {
                res
                    .status(200)
                    .cookie("user", {
                    _id: user._id,
                    name: user.name,
                }, {
                    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                    sameSite: "lax",
                })
                    .json({
                    status: "success",
                });
            }
            else {
                res.status(400).json({
                    status: "error",
                    type: consts_1.ErrorTypes.AUTH,
                    message: "Incorrect credentials, Please try again.",
                });
            }
        }
    }
}));
userRouter.get("/chats", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(req.query.userId).populate("chats").exec();
    if (!user)
        res.status(500).json({
            status: "error",
            type: consts_1.ErrorTypes.NOT_FOUND,
            message: "The user seems to not exist",
        });
    else
        res.status(200).json({
            chats: user.chats,
        });
}));
userRouter.get("/ids", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.query.emails);
    const emails = JSON.parse(req.query.emails);
    const ids = yield User_1.default.find({ email: { $in: emails } }, "_id");
    if (ids.length === 0) {
        res.status(200).json({
            status: "error",
            type: consts_1.ErrorTypes.NOT_FOUND,
            message: "No users with the given emails are found",
        });
    }
    else {
        if (ids.length !== emails.length) {
            res.status(404).json({
                status: "error",
                type: consts_1.ErrorTypes.NOT_FOUND,
                message: "One or more users with the given emails are not found",
            });
        }
        else {
            res.status(200).json({
                status: "success",
                ids,
            });
        }
    }
}));
userRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ids = yield User_1.default.find({}, "_id");
    if (ids.length == 0) {
        res.status(200).json({
            status: "error",
            type: consts_1.ErrorTypes.NOT_FOUND,
            message: "No users with the given emails are found",
        });
    }
    else {
        res.status(200).json({
            ids,
            status: "success",
        });
    }
}));
userRouter.post("/new", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne({ email: req.body.email });
    if (!user) {
        const saved = yield new User_1.default({
            name: req.body.name,
            email: req.body.email,
            password: yield argon2_1.default.hash(req.body.password),
        }).save();
        console.log(saved._id);
        res
            .status(200)
            .cookie("user", {
            _id: saved._id,
            name: saved.name,
        }, {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 100),
            sameSite: "lax",
        })
            .json({
            status: "success",
        });
    }
    else {
        res.status(400).json({
            status: "error",
            type: consts_1.ErrorTypes.ALREADY,
            message: "User already exists. Please register with a different email.",
        });
    }
}));
exports.default = userRouter;
