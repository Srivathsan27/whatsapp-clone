import mongoose, { Schema, Types } from "mongoose";
import { MessageProps, MessageSchema } from "./Message";

interface ChatProps {
  messages: [MessageProps];
  users: [Types.ObjectId];
  name: String;
}

const ChatSchema = new Schema<ChatProps>({
  messages: { type: [MessageSchema] },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  name: { type: String },
});

export const Chat = mongoose.model("Chat", ChatSchema);
