import { AxiosError } from "axios";
import React from "react";
import LoadingList from "./LoadingList.tsx";
import { ExtendedUser, TaskProp, UserProp } from "../types.ts";

interface Props {
  data: UserProp[] | TaskProp[] | ExtendedUser[]; // Adjust the type according to your data structure
  headerTitle: string[];
  size: number;
  loading: boolean;
  error: AxiosError | null;
  handleOnClick: (id: string) => void;
}

const List: React.FC<Props> = ({
  data,
  headerTitle,
  size,
  loading,
  error,
  handleOnClick,
}) => {
  console.log(data);
  return (
    <>
      {data.length > 0 && (
        <table className="table-auto w-full shadow-md">
          <thead className="border-b bg-gray-200">
            <tr>
              {Array.from({ length: size }, (_, index) => (
                <th className="text-left py-6" scope="col" key={index}>
                  {headerTitle[index]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                className="hover:bg-gray-200/50"
                key={index}
                onClick={() => {
                  handleOnClick(row._id);
                  console.log(row);
                }}
              >
                {Object.entries(row)
                  .slice(0, size) // Limit the columns based on 'size'
                  .map(([key, value]) => (
                    <td className="py-6 cursor-pointer" scope="row" key={key}>
                      {value}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {data.length === 0 && (
        <table className="table-auto w-full shadow-md">
          <thead className="border-b bg-gray-200">
            <tr>
              <th className="text-left py-6" scope="col">
                No Comrades
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-200/50">
              <td className="py-6 cursor-pointer" scope="row">
                Find a comrade to compete with
              </td>
            </tr>
          </tbody>
        </table>
      )}
      {loading && <LoadingList />}
      {error && <div>Couldn't load data</div>}
    </>
  );
};

export default List;
