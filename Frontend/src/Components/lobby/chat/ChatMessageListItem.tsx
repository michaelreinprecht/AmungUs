type ChatMessageListItemProps = {
  message: string;
};

export default function ChatMessageListItem({
  message,
}: ChatMessageListItemProps) {
  return (
    <tr>
      <td className="pl-2 text-black">{message}</td>
    </tr>
  );
}
