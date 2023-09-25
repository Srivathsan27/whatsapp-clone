import mongoose, { Schema, Types } from "mongoose";

export interface MessageProps {
  user: Types.ObjectId;
  timestamp: Date;
  viewStatus: boolean;
  content: string;
}

export const MessageSchema = new Schema<MessageProps>({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  timestamp: { type: Schema.Types.Date, default: new Date() },
  content: String,
  viewStatus: { type: Boolean, default: false },
});

const Message = mongoose.model("Message", MessageSchema);
export default Message;
