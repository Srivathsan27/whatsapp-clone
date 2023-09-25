import React, { useEffect, useState } from "react";
import { Avatar, ClickAwayListener, IconButton } from "@material-ui/core";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import "./Sidebar.css";
import SidebarChat from "./SidebarChat";
import { SearchOutlined } from "@material-ui/icons";
import { auth } from "../firebase";
import { useStateValue } from "../StateProvider";
import axios from "axios";
import { API_URL, axiosInstance } from "../consts";
import { cookie } from "../utils";
import Cookies from "js-cookie";

function Sidebar({ hide, updateUser }) {
  const [rooms, setRooms] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const [search, setSearch] = useState("");
  const [showdropdown, setDropdown] = useState(false);

  useEffect(() => {
    // const unsubscribe = db.collection("Rooms").onSnapshot((snapshot) =>
    //   setRooms(
    //     snapshot.docs.map((doc) => ({
    //       id: doc.id,
    //       data: doc.data(),
    //     }))
    //   )
    // );

    // return () => {
    //   unsubscribe();
    // };

    (async function () {
      const res = await axios.get(
        `${API_URL}/users/chats?userId=${cookie("user")._id}`
      );
      console.log(res);
      setRooms(
        res.data.chats.map((chat) => ({ roomId: chat._id, name: chat.name }))
      );
    })();
  }, []);

  const signOut = () => {
    Cookies.set("user", "", { expires: new Date(Date.now() - 200) });
    updateUser(null);
  };
  const createChat = async () => {
    setDropdown(!showdropdown);
    const members = prompt(
      "Please enter emails of the users separated by space"
    );
    const name = prompt("Please enter name of Chat!");
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

  const updateRooms = (room) => {
    console.log(room);
    setRooms((rooms) => [...rooms, { roomId: room._id, name: room.name }]);
  };

  return (
    <div className={hide ? "sidebar side__bar" : "sidebar"}>
      <div className="sidebar__header">
        <div className="sidebar__profile">
          <Avatar src={user?.photoURL} />
          <p>{cookie("user").name}</p>
        </div>
        <div className="sidebar__headerRight">
          <IconButton
            onClick={() =>
              alert(
                "Not added this functionality.\nClick on three dots to logout and add new room."
              )
            }
          >
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <ClickAwayListener onClickAway={() => setDropdown(false)}>
            <div className="dropdown">
              <IconButton
                onClick={() => {
                  setDropdown(!showdropdown);
                }}
              >
                <MoreVertIcon />
              </IconButton>
              <div
                className={
                  showdropdown ? "dropdown__list" : "dropdown__list hide"
                }
              >
                <ul>
                  <li onClick={createChat}>Add Room</li>
                  <li onClick={signOut}>Log Out</li>
                  <li
                    onClick={() =>
                      alert(
                        "Not added this functionality.\nTry Logout and add Room options"
                      )
                    }
                  >
                    Help ?
                  </li>
                </ul>
              </div>
            </div>
          </ClickAwayListener>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input
            placeholder="Search a room"
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="sidebar__chats">
        <SidebarChat addNewChat={true} updateRooms={updateRooms} />
        {rooms.map((room) => {
          if (
            room.name.toLowerCase().includes(search.toLowerCase()) ||
            search === ""
          ) {
            return (
              <SidebarChat
                key={room.roomId}
                id={room.roomId}
                name={room.name}
                updateRooms={updateRooms}
              />
            );
          }
          return <></>;
        })}
      </div>
    </div>
  );
}

export default Sidebar;
