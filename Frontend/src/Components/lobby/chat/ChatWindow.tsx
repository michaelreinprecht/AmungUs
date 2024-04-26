import { useChatWindow } from "./hooks/useChatWindow";
import ChatField from "./ChatField";
import ChatMessageList from "./ChatMessageList";
import { useState } from "react";

type ChatWindowProps = {
  activePlayerName: string;
  lobbyCode: string;
};

export default function ChatWindow({
  activePlayerName,
  lobbyCode,
}: ChatWindowProps) {
  const { showChat, show, hide, setShowChat } = useChatWindow();
  const [messages, setMessages] = useState<string[]>([]);

  return (
    <>
      <div className="row">
        <div
          className="fixed bottom-4 right-4 w-96 h-48"
          onMouseEnter={show()}
          onMouseLeave={hide()}
        >
          <ChatMessageList
            messages={messages}
            showChat={showChat}
            setShowChat={setShowChat} // Pass setShowChat to ChatMessageList
          />
          <ChatField
            setMessages={setMessages} // Pass setMessages
            activePlayerName={activePlayerName}
            lobbyCode={lobbyCode}
          />
        </div>
      </div>
    </>
  );
}
