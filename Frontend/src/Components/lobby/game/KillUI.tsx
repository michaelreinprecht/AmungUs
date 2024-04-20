import React from "react";

type KillUIProps = {
  onClick: () => void;
};

const KillUI: React.FC<KillUIProps> = ({ onClick }) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 10,
        left: 10,
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <img src="/KillUI.png" alt="UI Element"
        style={{ width: 100, height: 100 }} />
    </div>
  );
};

export default KillUI;
