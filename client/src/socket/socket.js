import { io } from "socket.io-client";
import reducer from "../reducer";

const socketPort = 3003;

export const socket = io(`http://localhost:${socketPort}`);

export function init() {
  socket.emit("connection");

  socket.on("error", (err) => {
    alert(`Error, ${err}`);
  });
}

export function close() {
  socket.emit("close");
}
