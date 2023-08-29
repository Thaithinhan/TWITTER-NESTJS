// MainChat.tsx
import React from "react";

import ChatHeader from "./Chatheader";
import InputArea from "./InputArea";
import Messages from "./Messages";

const MainChat = () => (
  <div className="main-chat">
    <ChatHeader />
    <Messages />
    <InputArea />
  </div>
);

export default MainChat;
