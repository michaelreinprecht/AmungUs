import { useState } from "react";
import ChatField from "./ChatField";
import ChatMessageList from "./ChatMessageList";

export default function ChatWindow() {
  const [showChat, setShowChat] = useState(true);

  return (
    <>
      <ChatMessageList showChat={showChat} setShowChat={setShowChat} />
      <ChatField setShowChat={setShowChat} />
    </>
  );
}
