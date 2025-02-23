import axios from "axios";
import AsideDetector from "./Components/Navigation/AsideDetector/AsideDetector";
import { Outlet } from "react-router-dom";
import Social from "./Components/Social/Social";

import { io } from "socket.io-client";

axios.defaults.withCredentials = true;

export default function App() {
    const socket = io("http://localhost:8000");

    socket.emit("sendMessage", { sender: "User1", content: "Oi" });

    socket.on("receiveMessage", (data) => {
        console.log("Message received: ", data);
    });

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
