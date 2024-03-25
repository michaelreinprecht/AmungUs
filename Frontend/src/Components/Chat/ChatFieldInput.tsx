type ChatFieldInputProps = {
  message: string;
  setMessage: (newMessage: string) => void;
  setShowChat: (newShowChat: boolean) => void;
};

export default function ChatFieldInput({
  message,
  setMessage,
  setShowChat,
}: ChatFieldInputProps) {
  return (
    <>
      <input
        type="text"
        className="form-control flex-grow w-full p-2 border border-gray-300 rounded-l"
        placeholder="Your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onMouseEnter={() => setShowChat(true)}
        onMouseLeave={() => setShowChat(false)}
      />
    </>
  );
}
