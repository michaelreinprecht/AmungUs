import { MouseEventHandler, useState } from "react";

export function useChatWindow() {
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

  return {
    showChat,
    show,
    hide,
    setShowChat, 
  };
}
