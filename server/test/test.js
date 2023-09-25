import { createServer } from "http";
import { io as Client } from "socket.io-client";
import { Server } from "socket.io";
import { assert } from "chai";

describe("Socket Testing", () => {
  let io, serverSocket, clientSocket;
  before((done) => {});

  after(() => {
    io.close();
    clientSocket.close();
  });

  describe("Connect method", () => {
    it("should return recieve ack", () => {});
  });
});
