import { Button } from "@material-ui/core";
import React, { useState } from "react";
import { API_URL } from "../consts";
import "./Login.css";
import axios from "axios";
import { cookie } from "../utils";
import { useHistory, useLocation } from "react-router-dom";
import Signup from "./Signin";
const minPLen = 2;

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const [signup, setSignup] = useState(false);

  const signIn = async () => {
    // auth
    //   .signInWithPopup(provider)
    //   .then(async (result) => {
    //     dispatch({
    //       type: actionTypes.SET_USER,
    //       user: result.user,
    //     });
    //     //localStorage.setItem("user", JSON.stringify(result.user));
    //   })
    //   .catch((error) => {
    //     alert(error.message);
    //   });

    if (email === "" || password.length <= minPLen) {
      alert("Please Fill the form correctly");
    } else {
      let valid = true;
      try {
        const res = await fetch(`${API_URL}/users/auth`, {
          method: "POST",
          body: JSON.stringify({
            email: email,
            password: password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        // setUser(cookie("user"));
        const json = await res.json();
        console.log(json);
        if (json.status === "error" && json.type === "invalid") {
          setSignup(true);
        } else if (json.status === "error" && json.type === "auth") {
          alert("Enter correct Credentials");
        } else {
          setUser(cookie("user"));
        }
      } catch (err) {
        console.log(err);
        valid = false;
      }
    }
  };
  return signup ? (
    <Signup setUser={setUser} />
  ) : (
    <div className="login">
      <div className="login__container">
        <img
          src="https://www.logo.wine/a/logo/WhatsApp/WhatsApp-Logo.wine.svg"
          alt=""
        />
        <div className="login__text">
          <h1>Sign in to WhatsApp</h1>
        </div>
        <div>
          <input
            type="email"
            className="input-box"
            placeholder="Email"
            onBlur={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            className="input-box"
            placeholder="Password"
            onBlur={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button onClick={signIn}>Sign In with Creddentials</Button>
        <Button onClick={() => setSignup(true)} style={{ marginLeft: "10px" }}>
          {" "}
          Sign Up
        </Button>
      </div>
    </div>
  );
}

export default Login;
