import React from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const LoadingList: React.FC = () => {
    return (
        <>
            <table className="table-auto w-full shadow-md">
                <thead className="border-b bg-gray-200">
                    <tr className="">
                        <th className="text-left py-6" scope="col">
                            ---
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="hover:bg-gray-200/50">
                        <td
                            className="flex w-full items-center justify-center"
                            scope="row"
                        >
                            <LoadingSpinner loading={true} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
};

export default LoadingList;
