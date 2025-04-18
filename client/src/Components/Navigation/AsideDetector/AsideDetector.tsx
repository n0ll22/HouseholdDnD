import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";

import { IoMenu } from "react-icons/io5";

const AsideDetector: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(
    window.innerWidth > 1280 ? false : true
  );

  const [isHidden, setIsHidden] = useState<boolean>(true); // boolean típusú változó

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 1280);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      setIsHidden(true);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsHidden(!isHidden); // állapot váltása
  };

  return (
    <>
      {isMobile && (
        <>
          <div
            className={`fixed flex z-10 items-center top-4 left-4 justify-center w-14 h-14 bg-gray-100 cursor-pointer rounded-lg text-5xl hover:bg-gray-300 shadow-md ${
              !isHidden ? "translate-x-72 rotate-90" : "translate-x-0"
            } transition-all ease-out duration-200`}
            onClick={toggleSidebar} // toggleSidebar hívása
          >
            <IoMenu />
          </div>
          <div
            className={`w-72 fixed z-20 bg-gray-100 transition-transform ${
              isHidden ? "transform -translate-x-72" : "transform translate-x-0"
            }`}
          >
            <Sidebar setInteracted={setIsHidden} />
          </div>
        </>
      )}
      {!isMobile && <Sidebar setInteracted={() => {}} />}
    </>
  );
};

export default AsideDetector;
