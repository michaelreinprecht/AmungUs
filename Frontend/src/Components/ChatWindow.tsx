import { useState } from "react";
import ChatInput from "./ChatInput";
import ChatMessageList from "./ChatMessageList";

export default function ChatWindow() {
  const [showChat, setShowChat] = useState(true);

  return (
    <>
      <ChatMessageList showChat={showChat} setShowChat={setShowChat} />
      <ChatInput setShowChat={setShowChat} />
    </>
  );
}
