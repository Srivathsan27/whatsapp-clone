import React, { useEffect, useState } from "react";
import { Avatar } from "@material-ui/core";
import "./SidebarChat.css";
import db from "../firebase";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { cookie } from "../utils";
import axios from "axios";
import { API_URL, axiosInstance } from "../consts";

function SidebarChat({ id, name, addNewChat, updateRooms }) {
  const [seed, setSeed] = useState("");
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 50000));
  }, []);

  useEffect(() => {
    if (id) {
      // db.collection("Rooms")
      //   .doc(id)
      //   .collection("messages")
      //   .orderBy("timestamp", "desc")
      //   .onSnapshot((resultsnap) => {
      //     setMessages(
      //       resultsnap.docs.map((doc) => {
      //         return doc.data();
      //       })
      //     );
      //   });
    }
  }, [id]);

  const createChat = async () => {
    const members = prompt(
      "Please enter emails of the users separated by space"
    );
    const name = prompt("Please enter name for Chat");
    if (members && name) {
      const res = await axios.get(
        `${API_URL}/users/ids?emails=${JSON.stringify(members.split(" "))}`
      );
      const ids = res.data?.ids?.map((id) => id._id);
      // console.log(cookie("user"));
      ids.unshift(cookie("user")._id);
      const res2 = await axiosInstance.post(`${API_URL}/chats/new`, {
        users: ids,
        name,
      });
      console.log(res2);
      // setRooms(rooms => [...rooms, ])
      updateRooms(res2.data);
    }
  };

  return !addNewChat ? (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="sidebarChat__info">
          <h2>{name}</h2>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="sidebarChat" id="add__chat">
      <h2>+ Add new Room</h2>
    </div>
  );
}

export default SidebarChat;
