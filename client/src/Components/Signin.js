import axios from "axios";
import React, { useState } from "react";
import { API_URL } from "../consts";
import { cookie } from "../utils";
import "./Signin.css";

function Signup({ setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPass, setConfPass] = useState("");

  const addUser = (e) => {
    e.preventDefault();

    (async function () {
      if (password != confPass) {
        alert("Please Ensure the passwords match");
      } else {
        const res = await axios.post(
          `${API_URL}/users/new`,
          {
            name,
            email,
            password,
          },
          { withCredentials: true }
        );

        if (res.data.status !== "error") {
          setUser(cookie("user"));
        }
      }
    })();
  };

  return (
    <div className="container">
      <div className="box">
        <form className="forms">
          <div className="content_box">
            <div className="title_div">
              <label className="title">SignUp</label>
            </div>
            <label>Name:</label>
            <div className="name">
              <input
                type="text"
                onBlur={(e) => setName(e.target.value)}
              ></input>
            </div>
            <label>Email:</label>
            <div className="mail_div">
              <input
                type="email"
                onBlur={(e) => setEmail(e.target.value)}
              ></input>
            </div>
            <label>New Password</label>
            <div className="pass_div">
              <input
                type="password"
                onBlur={(e) => setPassword(e.target.value)}
              ></input>
            </div>
            <label>Confirm Password</label>
            <div className="pass_div">
              <input
                type="password"
                onBlur={(e) => setConfPass(e.target.value)}
              ></input>
            </div>
            <button className="submit_button" onClick={addUser}>
              Submit
            </button>
          </div>
        </form>
      </div>
      <div className="box_II">
        <img
          src="https://www.logo.wine/a/logo/WhatsApp/WhatsApp-Logo.wine.svg"
          alt=""
        />
        <div className="text">
          <h1>WhatsApp Web</h1>
          {/* <h1>Sign In Page</h1> */}
          <p></p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
