import React, { useEffect, useState } from "react";
import "./App.css";
import Sidebar from "./Components/Sidebar";
import Chat from "./Components/Chat";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./Components/Login";
import db from "./firebase";

import Loading from "./Components/Loading";
import Cookies from "js-cookie";
import Signup from "./Components/Signin";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (Cookies.get("user")) {
      console.log("cookie found", Cookies.get("user"));
      setUser(Cookies.get("user"));
    }

    setLoading(false);

    // return () => listener();
  }, []);

  const removeRoom = (roomid) => {
    db.collection("Rooms")
      .doc(roomid)
      .delete()
      .then(() => {
        alert("Room Deleted");
      });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="app">
      {!user ? (
        <Login setUser={setUser} />
      ) : (
        <div className="app__body">
          <Router basename={process.env.PUBLIC_URL}>
            <Switch>
              <Route path="/" exact>
                <Sidebar hide={false} updateUser={(state) => setUser(state)} />
                <Chat hide={true} removeRoom={removeRoom} />
                <div className="project__info">
                  <img
                    src="https://www.logo.wine/a/logo/WhatsApp/WhatsApp-Logo.wine.svg"
                    alt=""
                  />
                  <div className="text">
                    <h1>WhatsApp Web Clone</h1>
                  </div>
                </div>
              </Route>
              <Route path="/rooms/:chatId">
                <Sidebar hide={true} />
                <Chat hide={false} removeRoom={removeRoom} />
              </Route>
            </Switch>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
