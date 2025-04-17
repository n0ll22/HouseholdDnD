import React, { useState } from "react";
import pfps from "../../img/pfps/pfps.json";
import { Api } from "../../QueryFunctions";

interface Props {
  _id: string;
}

const AvatarSelector: React.FC<Props> = ({ _id }) => {
  const [isActive, setIsActive] = useState<boolean>(true);

  const handleSelected = async (avatar: string) => {
    const updateData = { avatar, _id };
    await Api().putAvatar(updateData);
  };
  console.log(pfps);
  return (
    isActive && (
      <div className="absolute left-0 top-0 w-full h-full bg-gray-800/50 z-30 flex flex-col justify-center items-center transition-all">
        <div className="w-96 sm:w-80 h-96 bg-gray-100 rounded-2xl">
          <h1 className="w-full text-center py-5 text-2xl font-bold">
            Choose your avatar!
          </h1>
          <div className="flex flex-wrap justify-center items-center ">
            {pfps.map((i, index) => (
              <div
                className="w-20 h-20 m-1 bg-cover bg-center rounded-lg hover:outline hover:outline-2 hover:cursor-pointer"
                key={index}
                style={{
                  backgroundImage: `url("/src/img/pfps/${i}")`,
                }}
                onClick={() => handleSelected(i)}
              ></div>
            ))}
          </div>
        </div>
        <div className="p-2">
          <input
            className="bg-gray-100 p-2 rounded-lg font-semibold hover:bg-red-300 transition active:bg-red-500 active:translate-y-1"
            type="button"
            value="Cancel"
            onClick={() => {
              setIsActive(false);
              window.location.reload();
            }}
          />
        </div>
      </div>
    )
  );
};

export default AvatarSelector;
