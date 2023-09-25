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
const consts_1 = require("./consts");
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRouter_1 = __importDefault(require("./rotuers/userRouter"));
const auth_1 = __importDefault(require("./middleware/auth"));
const chatsRouter_1 = __importDefault(require("./rotuers/chatsRouter"));
const sockets_1 = __importDefault(require("./sockets"));
const cors_1 = __importDefault(require("cors"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded());
        app.use((0, cookie_parser_1.default)());
        app.use((0, cors_1.default)({ credentials: true, origin: "http://localhost:3000" }));
        yield mongoose_1.default.connect(consts_1.mongoUri);
        // User.findByIdAndUpdate();
        console.log("Working");
        (0, sockets_1.default)();
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
        app.use("/users", userRouter_1.default);
        app.use("/chats", auth_1.default, chatsRouter_1.default);
        app.listen(consts_1.apiPort, () => console.log(`Server started on port ${consts_1.apiPort}`));
    });
}
main().then(() => console.log("hell"));
