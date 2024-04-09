import { useChatWindow } from "./hooks/useChatWindow";
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
  const { showChat, show, hide, setShowChat } = useChatWindow();

  return (
    <>
      <div
        className="fixed bottom-4 right-4 w-96 h-48"
        onMouseEnter={show()}
        onMouseLeave={hide()}
      >
        <ChatMessageList
          showChat={showChat}
          setShowChat={setShowChat} // Pass setShowChat to ChatMessageList
          lobbyCode={lobbyCode}
        />
        <ChatField activePlayerName={activePlayerName} lobbyCode={lobbyCode} />
      </div>
    </>
  );
}
