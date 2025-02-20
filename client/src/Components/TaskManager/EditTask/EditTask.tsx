import React, { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Task } from "../../types";
import axios, { AxiosError } from "axios";

//Adatok sémája

//Beállítom, hogy milyen adat érkezik a prop-hoz
const EditTask: React.FC = () => {
  const { filteredTask } = useOutletContext<{ filteredTask: Task[] }>();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>("");
  const [error, setError] = useState("");

  console.log(isDeleting);

  const handleDelete = async () => {
    console.log("Deleting task " + deleteId);

    await axios
      .delete("http://localhost:8000/task/" + deleteId)
      .then(() => {
        console.log("Deleted!");
        setIsDeleting(false);
        window.location.reload();
      })
      .catch((err: AxiosError) => setError(() => err.message));
  };

  useEffect(() => {
    if (isDeleting) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isDeleting]);

  //A beérkezett adatot megjelenítjük
  return (
    <main className="flex flex-col w-full items-start p-10 animate-fadeInFast">
      <h1 className="border-l-4 pl-2 py-2 font-bold text-5xl my-10">
        Recreation of Tasks
      </h1>
      <div className="w-full flex flex-col items-center">
        <div className="grid grid-cols-3 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-16 xl:gap-5">
          {filteredTask.map((i: Task) => (
            <div
              key={i._id}
              className="mb-10 max-w-72 mr-10 p-4 h-60 flex flex-col border-b-2 justify-between "
            >
              <h2 className="font-bold text-3xl h-32">{i.title}</h2>
              <p className="mb-2">{i.description.substring(0, 50)}...</p>
              <div className="flex w-full justify-between font-bold">
                <div>EXP: {i.exp}</div>

                <Link to={i._id}>
                  <div> {">"} Edit</div>
                </Link>
                <button
                  onClick={() => {
                    window.scrollTo(0, 0);
                    setIsDeleting(true);
                    setDeleteId(i._id);
                  }}
                >
                  {">"} Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isDeleting && (
        <div className="absolute z-20 h-screen w-screen top-0 left-0 bg-black/50 flex flex-col items-center justify-center">
          <div className="w-80 h-60 bg-white p-4 text-center flex flex-col justify-between rounded-xl">
            <div className="space-y-4">
              <h2 className="text-center font-bold text-xl">Are you sure?</h2>
              <p>Do you really want to delete this task?</p>
            </div>
            {error && <div>ERROR: {error}</div>}
            <div className="space-x-20 p-2">
              <input
                className="py-1 w-12 bg-red-400 rounded-lg text-white"
                type="button"
                value="Yes"
                onClick={handleDelete}
              />
              <input
                className="py-1 w-12 bg-green-400 rounded-lg text-white"
                type="button"
                value="No"
                onClick={() => {
                  setIsDeleting(false);
                  setError("");
                }}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default EditTask;
