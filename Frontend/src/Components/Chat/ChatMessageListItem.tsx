type ChatMessageListItemProps = {
  index: number;
  message: string;
};

export default function ChatMessageListItem({
  index,
  message,
}: ChatMessageListItemProps) {
  return (
    <tr key={index}>
      <td className="pl-2">{message}</td>
    </tr>
  );
}
