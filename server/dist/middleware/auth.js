"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("../consts");
function auth(req, res, next) {
    var _a;
    if (req.cookies.user) {
        next();
    }
    else if ((_a = req.body) === null || _a === void 0 ? void 0 : _a.user) {
        next();
    }
    else {
        res.status(401).json({
            status: "error",
            type: consts_1.ErrorTypes.AUTH,
            message: "User not Authenticated",
        });
    }
}
exports.default = auth;
