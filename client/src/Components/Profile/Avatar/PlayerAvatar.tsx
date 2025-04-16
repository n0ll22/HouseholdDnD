import React from "react";

interface Props {
  avatar: string;
}

const PlayerAvatar: React.FC<Props> = ({ avatar }) => {
  return (
    <div
      className="w-40 h-40 bg-cover bg-center flex-shrink-0"
      style={{
        backgroundImage: `url("/src/img/pfps/${avatar}")`,
      }}
    ></div>
  );
};

export default PlayerAvatar;
