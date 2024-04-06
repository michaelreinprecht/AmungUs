import { MouseEventHandler, useState } from "react";
import ChatField from "./ChatField";
import ChatMessageList from "./ChatMessageList";

type ChatWindowProps = {
  activePlayerName: string;
  lobbyCode: string;
};

export default function ChatWindow({
  activePlayerName,
  lobbyCode,
}: ChatWindowProps) {
  const [showChat, setShowChat] = useState(true);

  function show(): MouseEventHandler<HTMLDivElement> {
    return () => {
      setShowChat(true);
    };
  }

  function hide(): MouseEventHandler<HTMLDivElement> {
    return () => {
      setShowChat(false);
    };
  }

  return (
    <>
      <div
        className="fixed bottom-4 right-4 w-96 h-48"
        onMouseEnter={show()}
        onMouseLeave={hide()}
      >
        <ChatMessageList
          showChat={showChat}
          setShowChat={setShowChat}
          lobbyCode={lobbyCode}
        />
        <ChatField activePlayerName={activePlayerName} lobbyCode={lobbyCode} />
      </div>
    </>
  );
}
