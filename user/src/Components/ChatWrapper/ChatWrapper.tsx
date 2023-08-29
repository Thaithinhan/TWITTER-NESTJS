import "./Chat.css";

// ChatWrapper.tsx
import React from "react";

import MainChat from "./MainChat";
import Sidebar from "./Sidebar";

const ChatWrapper = () => (
  <div className="chat-wrapper">
    <Sidebar />
    <MainChat />
  </div>
);

export default ChatWrapper;
