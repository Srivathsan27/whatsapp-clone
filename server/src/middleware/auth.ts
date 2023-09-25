import { NextFunction, Request, Response } from "express";
import { ErrorTypes } from "../consts";

export default function auth(req: Request, res: Response, next: NextFunction) {
  if (req.cookies.user) {
    next();
  } else if (req.body?.user) {
    next();
  } else {
    res.status(401).json({
      status: "error",
      type: ErrorTypes.AUTH,
      message: "User not Authenticated",
    });
  }
}
