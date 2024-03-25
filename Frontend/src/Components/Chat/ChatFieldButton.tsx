type ChatFieldButtonProps = {
  buttonText: string;
  sendMessage: () => void;
};

export default function ChatFieldButton({
  buttonText,
  sendMessage,
}: ChatFieldButtonProps) {
  return (
    <button
      className="btn btn-default bg-gray-700 text-white font-semibold py-2 px-4 rounded-r rounded-none"
      onClick={sendMessage}
      type="button"
    >
      {buttonText}
    </button>
  );
}
