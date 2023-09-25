import React, { useEffect, useState } from "react";
import { Avatar, ClickAwayListener, IconButton } from "@material-ui/core";
import "./Chat.css";
import {
  AttachFile,
  InsertEmoticon,
  Mic,
  MoreVert,
  SearchOutlined,
  ArrowBack,
} from "@material-ui/icons";
import { Link, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { API_URL, axiosInstance } from "../consts";
import Cookies from "js-cookie";
import { socket } from "../socket/socket";
import { cookie } from "../utils";

function Chat({ hide, removeRoom }) {
  const [seed, setSeed] = useState("");
  const [input, setInput] = useState("");
  const { chatId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [showdropdown, setDropdown] = useState(false);

  //  git pull origin main
  //  git push --all

  useEffect(() => {
    socket.emit("open-chat", { chatId });
    setDropdown(false);
    setSeed(Math.floor(Math.random() * 50000));
    if (chatId) {
      // fetch(`${API_URL}/chats/chat`, {
      //   body: { chatId },
      //   method: "POST",
      // }).then((chat) => {
      //   console.log(chat);
      //   if (!chat) {
      //     console.log("Oops, some error occured");
      //   } else {
      //     // setMessages(chat.messages);
      //     // setRoomName(chatId);
      //   }
      // });

      (async function () {
        const res = await axiosInstance.get(
          `${API_URL}/chats/chat?chatId=${chatId}`
        );
        console.log(res);
        setRoomName(res.data.name);
        setMessages(res.data.messages);
      })();
    }

    // if (chatId) {
    //   db.collection("Rooms")
    //     .doc(chatId)
    //     .onSnapshot((snapshot) => {
    //       if (snapshot.data()) {
    //         setRoomName(snapshot.data().name);
    //       }
    //     });
    //   db.collection("Rooms")
    //     .doc(chatId)
    //     .collection("messages")
    //     .orderBy("timestamp", "asc")
    //     .onSnapshot((resultsnap) => {
    //       setMessages(
    //         resultsnap.docs.map((doc) => {
    //           return doc.data();
    //         })
    //       );
    //     });
    // }
  }, [chatId]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 50000));

    socket.on("error", (err) => alert(`Error, ${err}`));
    socket.on("message", ({ message }) => {
      setMessages((mList) => [...mList, message]);
    });

    return () => socket.emit("leave-chats");
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input) {
      // db.collection("Rooms").doc(chatId).collection("messages").add({
      //   message: input,
      //   name: user.displayName,
      //   email: user.email,
      //   timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      // });

      socket.emit("message", {
        chatId,
        userId: cookie("user")._id,
        content: input,
      });

      setInput("");
    } else {
      alert("Type something first");
    }
  };
  return (
    <div className={hide ? "chat Chat" : "chat"}>
      <div className="chat__header">
        <Link to="/">
          <IconButton>
            <ArrowBack />
          </IconButton>
        </Link>
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
        </div>
        <div className="chat__headerRight">
          <IconButton
            onClick={() =>
              alert(
                "Not added this functionality.\nClick on three dots to delete room."
              )
            }
          >
            <SearchOutlined />
          </IconButton>
          {/*<IconButton>
            <AttachFile />s
          </IconButton>*/}
          <ClickAwayListener onClickAway={() => setDropdown(false)}>
            <div className="dropdown">
              <IconButton
                onClick={() => {
                  setDropdown(!showdropdown);
                }}
              >
                <MoreVert />
              </IconButton>
              <div
                className={
                  showdropdown ? "dropdown__list" : "dropdown__list hide"
                }
              >
                <ul>
                  <Link to="/">
                    <li
                      onClick={() => {
                        removeRoom(chatId);
                      }}
                    >
                      Delete Room
                    </li>
                  </Link>
                </ul>
              </div>
            </div>
          </ClickAwayListener>
        </div>
      </div>
      <div className="chat__body">
        {messages.map((message) => (
          <div key={message.timestamp}>
            <p
              className={`chat__message ${
                message.user._id === cookie("user")._id && "chat__receiver"
              }`}
            >
              <span className="chat__name">{message.user.name}</span>
              {message.content}
              <span className="chat__timestamp">{message.timestamp}</span>
            </p>
          </div>
        ))}
      </div>
      <div className="chat__footer">
        <IconButton
          onClick={() =>
            alert(
              "Not added this functionality.\nClick on three dots on top right to delete room."
            )
          }
        >
          <InsertEmoticon />
        </IconButton>
        <IconButton
          className="attach__file"
          onClick={() =>
            alert(
              "Not added this functionality.\nClick on three dots on top right to delete room."
            )
          }
        >
          <AttachFile />
        </IconButton>
        <form>
          <input
            required={true}
            type="text"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            placeholder="Type a message"
          />
          <button type="submit" onClick={sendMessage}>
            Send a message
          </button>
        </form>
        <IconButton
          onClick={() =>
            alert(
              "Not added this functionality.\nClick on three dots on top right to delete room."
            )
          }
        >
          <Mic />
        </IconButton>
      </div>
    </div>
  );
}

export default Chat;
