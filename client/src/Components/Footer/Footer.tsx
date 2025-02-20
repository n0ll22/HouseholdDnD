import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
    return (
        <footer className="flex justify-center w-full py-10 bg-gray-800 text-gray-200">
            <div className="flex flex-col w-3/4">
                <p>
                    HouseholdDND <sup>©</sup>
                </p>
                <p>Do you have any question?</p>
                <Link
                    to="/"
                    className="w-52 p-2 rounded-lg border border-gray-200"
                >
                    Feel free to contact us!
                </Link>
            </div>
        </footer>
    );
};

export default Footer;
