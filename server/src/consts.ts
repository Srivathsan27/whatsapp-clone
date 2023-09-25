import { Socket } from "socket.io";
export const mongoUri =
  "mongodb+srv://srivathsan:srivathsan@cluster0.r4z8p0g.mongodb.net/";

export const ErrorTypes = {
  INVALID: "invalid",
  AUTH: "auth",
  CONFLICT: "conflict",
  ALREADY: "already",
  NOT_FOUND: "not-found",
};

export const socketPort = 3003;
export const apiPort = 5000;
export const clientPort = 3000;
