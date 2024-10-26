import React, { useState, useEffect } from "react";
import queryString from "query-string"; //used to get data from URL
import io from "socket.io-client";

import "./Chat.css";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import UserContainer from "../UserContainer/UserContainer";

import ScrollToBottom from "react-scroll-to-bottom";

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const ENDPOINT = "localhost:8000";

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    socket.emit("join", { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    }); 

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, [messages]);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  return (
    <div>
      <div className="outer">
        <div className="chat-container">
          <div className="search-container" style={{ background: "#74b816" }}>
            <h1>Chat App</h1>
          </div>

          <div className="conversation-list" style={{ background: "#74b816" }}>
            <UserContainer users={users} />
          </div>

          <div
            className="new-message-container"
            style={{ background: "#74b816" }}
          ></div>

          <div className="chat-title">
            <InfoBar room={room} />
          </div>

          <ScrollToBottom className="chat-message-list">
            <Messages messages={messages} name={name} />
          </ScrollToBottom>

          <div className="chat-form">
            <Input
              message={message}
              setMessage={setMessage}
              sendMessage={sendMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// this contains all the chart part
export default Chat;
