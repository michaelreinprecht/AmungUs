import { useEffect, useRef, useState } from "react";

export function useChatMessageList(
  messages: string[], // List of chat messages
  setShowChat: (newShowChat: boolean) => void
) {
  const tableRef = useRef<HTMLDivElement>(null);

  // UseEffect is a react function, it gets called whenever the passed list (in this case messages) is changed.
  // In this case we use it so scroll to the bottom of the list once a new message is added.
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollTop = tableRef.current.scrollHeight;
    }

    // Show the chat message list when a new message is added
    setShowChat(true);

    // Set a timeout to hide the chat message list after 5 seconds
    setTimeout(() => {
      setShowChat(false);
    }, 5000);
  }, [messages]);

  return { tableRef };
}
