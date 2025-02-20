import axios from "axios";
import AsideDetector from "./Components/Navigation/AsideDetector/AsideDetector";
import { Outlet } from "react-router-dom";
import Social from "./Components/Social/Social";

axios.defaults.withCredentials = true;

export default function App() {
  return (
    <div className="grid grid-cols-6 xl:block">
      <Social />
      <div className="col-span-1">
        <AsideDetector />
      </div>
      <div className="col-span-5 xl:block">
        <Outlet />
      </div>
    </div>
  );
}
