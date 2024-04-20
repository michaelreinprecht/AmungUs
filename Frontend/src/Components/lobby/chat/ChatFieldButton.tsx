type ChatFieldButtonProps = {
  buttonText: string;
};

export default function ChatFieldButton({ buttonText }: ChatFieldButtonProps) {
  return (
    <button
      className="btn btn-default bg-gray-700 text-white font-semibold py-2 px-4 rounded-r rounded-none"
      type="submit"
    >
      {buttonText}
    </button>
  );
}
