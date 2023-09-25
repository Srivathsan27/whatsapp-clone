import express from "express";
import { ErrorTypes } from "../consts";
import User from "../models/User";
import argon2 from "argon2";

const userRouter = express.Router();

userRouter.post("/auth", async (req, res) => {
  // console.log(req.cookies);
  if (req.cookies.user) {
    res.status(200).json({
      status: "success",
    });
  } else {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).json({
        status: "error",
        type: ErrorTypes.INVALID,
        message: "User does not exist",
      });
    } else {
      if (await argon2.verify(user.password, req.body.password)) {
        res
          .status(200)
          .cookie(
            "user",
            {
              _id: user._id,
              name: user.name,
            },
            {
              expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
              sameSite: "lax",
            }
          )
          .json({
            status: "success",
          });
      } else {
        res.status(400).json({
          status: "error",
          type: ErrorTypes.AUTH,
          message: "Incorrect credentials, Please try again.",
        });
      }
    }
  }
});

userRouter.get("/chats", async (req, res) => {
  const user = await User.findById(req.query.userId).populate("chats").exec();
  if (!user)
    res.status(500).json({
      status: "error",
      type: ErrorTypes.NOT_FOUND,
      message: "The user seems to not exist",
    });
  else
    res.status(200).json({
      chats: user.chats,
    });
});

userRouter.get("/ids", async (req, res) => {
  // console.log(req.query.emails);
  const emails = JSON.parse(req.query.emails as string);
  const ids = await User.find({ email: { $in: emails } }, "_id");
  if (ids.length === 0) {
    res.status(200).json({
      status: "error",
      type: ErrorTypes.NOT_FOUND,
      message: "No users with the given emails are found",
    });
  } else {
    if (ids.length !== emails.length) {
      res.status(404).json({
        status: "error",
        type: ErrorTypes.NOT_FOUND,
        message: "One or more users with the given emails are not found",
      });
    } else {
      res.status(200).json({
        status: "success",
        ids,
      });
    }
  }
});

userRouter.get("/", async (req, res) => {
  const ids = await User.find({}, "_id");
  if (ids.length == 0) {
    res.status(200).json({
      status: "error",
      type: ErrorTypes.NOT_FOUND,
      message: "No users with the given emails are found",
    });
  } else {
    res.status(200).json({
      ids,
      status: "success",
    });
  }
});

userRouter.post("/new", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    const saved = await new User({
      name: req.body.name,
      email: req.body.email,
      password: await argon2.hash(req.body.password),
    }).save();

    console.log(saved._id);
    res
      .status(200)
      .cookie(
        "user",
        {
          _id: saved._id,
          name: saved.name,
        },
        {
          expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 100),
          sameSite: "lax",
        }
      )
      .json({
        status: "success",
      });
  } else {
    res.status(400).json({
      status: "error",
      type: ErrorTypes.ALREADY,
      message: "User already exists. Please register with a different email.",
    });
  }
});

export default userRouter;
