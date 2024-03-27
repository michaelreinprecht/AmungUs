type ChatFieldInputProps = {
  message: string;
  setMessage: (newMessage: string) => void;
};

export default function ChatFieldInput({
  message,
  setMessage,
}: ChatFieldInputProps) {
  return (
    <>
      <input
        type="text"
        className="form-control flex-grow w-full p-2 border border-gray-300 rounded-l"
        placeholder="Your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    </>
  );
}
