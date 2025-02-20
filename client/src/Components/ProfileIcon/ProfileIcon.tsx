import React from "react";
import { Link } from "react-router-dom";

type Props = {
  avatar: string;
};

const ProfileIcon: React.FC<Props> = ({ avatar }) => {
  return (
    <div
      className={`fixed right-4 top-4 w-14 h-14 bg-gray-100 rounded-lg cursor-pointer text-4xl flex items-center justify-center hover:bg-gray-300 transition-all shadow-md
                    `}
    >
      <Link
        reloadDocument
        to="/profile"
        className="absolute w-14 h-14 rounded-md shadow-lg cursor-pointer bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage: `url("/src/img/pfps/${avatar}")`,
        }}
      ></Link>
    </div>
  );
};

export default ProfileIcon;
