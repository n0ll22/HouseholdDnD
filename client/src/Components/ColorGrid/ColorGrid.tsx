import React from "react";

interface Props {
    data: string[]; //It needs an element, and a hover element
    func: (x: string) => void;
}

const ColorGrid: React.FC<Props> = ({ data, func }) => {
    return (
        <>
            <div className="grid grid-cols-5 grid-rows-4 place-items-center gap-4 py-4">
                {data &&
                    data.map((i, index) => (
                        <div
                            key={index}
                            className={`${i} w-12 h-12 hover:scale-105 active:scale-95 transition rounded`}
                            onClick={() => {
                                func(i);
                                window.location.reload();
                            }}
                        ></div>
                    ))}
            </div>
        </>
    );
};

export default ColorGrid;
