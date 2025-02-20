import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";

import { Task } from "../../types";

const EditTaskDetail: React.FC = () => {
  const { id } = useParams();
  const { filteredTask } = useOutletContext<{ filteredTask: Task[] }>();
  const [task, setTask] = useState<Task>();
  const [tutorialInput, setTutorialInput] = useState<string>("");

  console.log(filteredTask);
  useEffect(() => {
    if (filteredTask) {
      const findTask = filteredTask.find((v) => v._id === id);
      if (findTask) {
        setTask(findTask);
      }
    }
  }, [id, filteredTask]);

  //Új tutorial hozzáadása a feladat objecthez
  const handleAddTutorial = () => {
    if (tutorialInput) {
      setTask((prev) => ({
        ...prev!,
        tutorial: [...prev!.tutorial, tutorialInput],
      }));
    }
  };

  //Tutorial törlése
  const handleRemoveTutorial = (index: number) => {
    const updateTutorial = [...(task!.tutorial ?? [])];
    updateTutorial.splice(index, 1);
    setTask((prev) => ({ ...prev!, tutorial: updateTutorial }));
  };

  //Közzététel esetén id alapján frissítsünk
  const handleSubmit = async () => {
    await axios
      .put("http://localhost:8000/task/" + id, task) // Replace taskId with the actual id value
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  console.log(task?.tutorial);

  return (
    <main className="flex flex-col w-full h-full items-center p-10">
      {task && (
        <>
          <h1 className="font-bold text-4xl">Resurrection of {task?.title}</h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center w-full p-8"
          >
            <div className="w-96 p-2">
              <div className="flex flex-col mb-4">
                <label htmlFor="title" className="mb-1">
                  Title:
                </label>
                <input
                  autoComplete="off"
                  className="border rounded-md px-2 py-1"
                  type="text"
                  name="title"
                  id="title"
                  required
                  onChange={(e) =>
                    setTask((prev) => ({
                      ...prev!,
                      title: e.target.value,
                    }))
                  }
                  value={task?.title}
                />
              </div>

              <div className="flex flex-col mb-4">
                <label htmlFor="desc" className="mb-1">
                  Description:
                </label>
                <textarea
                  autoComplete="off"
                  className="border rounded-md px-2 py-1"
                  name="desc"
                  id="desc"
                  required
                  onChange={(e) =>
                    setTask((prev) => ({
                      ...prev!,
                      description: e.target.value,
                    }))
                  }
                  value={task?.description}
                ></textarea>
              </div>

              <div className="flex flex-col mb-4">
                <label htmlFor="exp" className="mb-1">
                  EXP:
                </label>
                <input
                  id="exp"
                  className="border rounded-md px-2 py-1"
                  type="number"
                  name="exp"
                  required
                  onChange={(e) =>
                    setTask((prev) => ({
                      ...prev!,
                      exp: parseInt(e.target.value),
                    }))
                  }
                  value={task?.exp?.toString()}
                />
              </div>

              <div className="flex flex-col mb-4">
                <label htmlFor="tuts" className="mb-1">
                  Tutorials (Embedded YT Links):
                </label>
                <div>
                  <input
                    className="border rounded-md px-2 py-1 w-10/12"
                    type="text"
                    name="tutorial"
                    id="tuts"
                    onChange={(e) => setTutorialInput(e.target.value)}
                    value={tutorialInput}
                  />
                  <input
                    className="border rounded-lg mb-2 w-2/12 px-2 py-1 bg-white cursor-pointer hover:bg-gray-200 active:bg-gray-300"
                    type="button"
                    value="Add"
                    onClick={handleAddTutorial}
                  />
                </div>
                <div className="w-full p-2 bg-white rounded-lg border">
                  {task?.tutorial &&
                    task?.tutorial.map((i, index) => (
                      <div
                        className="flex items-center justify-between"
                        key={index}
                      >
                        <div className="">{i}</div>
                        <input
                          type="button"
                          className="w-3 h-3 bg-red-400 hover:bg-red-300 active:bg-red-500"
                          onClick={() => handleRemoveTutorial(index)}
                        />
                      </div>
                    ))}
                </div>
              </div>

              <input
                type="submit"
                name="submit"
                id="submit"
                className=" border rounded-lg w-full px-2 py-1 bg-white cursor-pointer hover:bg-gray-200 active:bg-gray-300"
              />
            </div>
          </form>
        </>
      )}

      <h2 className="font-bold text-xl">
        <Link to="/taskManager/edit">{"<"}Back</Link>
      </h2>
    </main>
  );
};

export default EditTaskDetail;
