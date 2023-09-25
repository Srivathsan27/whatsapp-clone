import mongoose, { Schema, Types } from "mongoose";

interface UserProps {
  name: string;
  email: string;
  password: string;
  chats?: [Types.ObjectId];
}

const UserSchema = new Schema<UserProps>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  chats: { type: [Schema.Types.ObjectId], ref: "Chat" },
});

const User = mongoose.model("User", UserSchema);
export default User;
