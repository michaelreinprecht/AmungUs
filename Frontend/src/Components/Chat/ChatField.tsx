import { useChatField } from "./useChatField";
import ChatFieldButton from "./ChatFieldButton";
import ChatFieldInput from "./ChatFieldInput";

type ChatFieldProps = {
  activePlayerName: string;
  lobbyCode: string;
};

export default function ChatField({
  activePlayerName,
  lobbyCode,
}: ChatFieldProps) {
  const { message, setMessage, sendMessage } = useChatField(activePlayerName, lobbyCode);

  return (
    <div className="fixed bottom-4 right-4 w-96">
      <form onSubmit={sendMessage}>
        <div className="flex w-full">
          <div className="flex-grow">
            <ChatFieldInput message={message} setMessage={setMessage} />
          </div>
          <ChatFieldButton buttonText="Send" />
        </div>
      </form>
    </div>
  );
}
