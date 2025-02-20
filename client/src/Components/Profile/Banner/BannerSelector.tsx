import React from "react";
import ColorGrid from "../../ColorGrid/ColorGrid.tsx";
import axios from "axios";

interface Props {
    isActive: boolean;
}

const BannerSelector: React.FC<Props> = ({ isActive }) => {
    const colors = [
        "bg-red-400",
        "bg-green-400",
        "bg-blue-400",
        "bg-purple-400",
        "bg-pink-400",
        "bg-yellow-300",
        "bg-slate-400",
        "bg-lime-400",
        "bg-teal-400",
        "bg-orange-400",
        "bg-gradient-to-r from-red-400 to-pink-400",
        "bg-gradient-to-r from-green-400 to-teal-400",
        "bg-gradient-to-r from-blue-400 to-violet-400",
        "bg-gradient-to-r from-pink-400 to-red-400",
        "bg-gradient-to-r from-purple-400 to-indigo-400",
        "bg-gradient-to-r from-yellow-300 to-orange-400",
        "bg-gradient-to-r from-slate-400 to-slate-500",
        "bg-gradient-to-r from-lime-400 to-green-500",
        "bg-gradient-to-r from-teal-400 to-cyan-400",
        "bg-gradient-to-r from-orange-400 to-red-400",
    ];

    const setColor = async (banner: string) => {
        axios
            .put("http://localhost:8000/user/updateBanner", { banner: banner })
            .then((res) => console.log(res.data))
            .then((err) => console.error(err));
    };

    return (
        <>
            {isActive && (
                <div className="absolute z-10 bg-gray-800/20 top-0 left-0 w-screen h-screen flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <h2 className="text-center font-bold text-xl">
                            Banner Selector
                        </h2>

                        <ColorGrid data={colors} func={setColor} />
                    </div>
                </div>
            )}
        </>
    );
};

export default BannerSelector;
