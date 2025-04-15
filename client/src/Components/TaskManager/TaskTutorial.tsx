import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useGet from "../../Hooks/useGet";
import { TaskProp } from "../types";

const TaskTutorial = () => {
  const { id } = useParams();

  const { data } = useGet<TaskProp>("http://localhost:8000/task/" + id);

  const [task, setTask] = useState<TaskProp>();
  const [loadingVideo, setLoadingVideo] = useState<boolean>(true);

  const handleLoad = () => {
    setLoadingVideo(false);
  };

  useEffect(() => {
    if (data) {
      setTask({ ...data });
    }
  }, [data]);

  console.log(data);
  return (
    <main className=" flex flex-col w-full items-start p-10">
      <h1 className="border-l-4 pl-2 py-2 font-bold text-5xl mb-5">
        Hall of Tutorials
      </h1>
      {task && (
        <>
          <h3 className="border-l-4 font-bold text-xl pl-2 py-2">
            Tutorial Page about {task.title.toLowerCase()}.
          </h3>
          <div className="border-l-4 my-5 w-full flex justify-center flex-wrap">
            {loadingVideo && (
              <h3 className="font-bold text-base absolute">
                Loading videos...
              </h3>
            )}
            {task?.tutorial?.map((i, index) => (
              <iframe
                key={index}
                className="mx-2 my-10 rounded-xl border"
                width="560"
                height="315"
                src={
                  "https://www.youtube.com/embed/Map7d0M0xqw?si=N-yuwoNZq37pyUb0"
                }
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                onLoad={handleLoad}
                name={i}
              ></iframe>
            ))}
          </div>
        </>
      )}
      <div className="border-l-4 font-bold text-xl pl-2 py-2">
        <Link to="/taskManager/list">{"<"} Back</Link>
      </div>
    </main>
  );
};

export default TaskTutorial;
