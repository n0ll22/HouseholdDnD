const router = require("express").Router();
const auth = require("../middleware/auth");
const Task = require("../models/taskModel");
const User = require("../models/userModel");
const Process = require("../models/processModel");
const queryOptions = require("../queryOptions");

router.get("/", auth, async (req, res) => {
  try {
    const queries = req.query;

    const { query, sortOptions, skip, limit, page } = queryOptions(queries);

    const totalTasks = await Task.countDocuments(query);

    const allTasks = await Task.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      tasks: allTasks,
      totalTasks,
      totalPages: Math.ceil(totalTasks / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/new", auth, async (req, res) => {
  try {
    const { title, description, exp, tutorial, _length } = req.body;

    await Task.create({
      title,
      description,
      exp,
      _length,
      tutorial,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Get tasks by taskIds
router.post("/taskByIds", async (req, res) => {
  try {
    const ids = req.body;

    if (!ids) {
      return res.status(400).send("Cannot find task with this ID");
    }

    const tasks = await Task.find({ _id: { $in: ids } });
    const taskMap = new Map();
    tasks.forEach((task) => taskMap.set(task._id.toString(), task));
    const result = ids.map((id) => taskMap.get(id));

    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/process", async (req, res) => {
  try {
    const { processId } = req.query;

    if (!processId) {
      return res.status(400).json({ error: "No process id was provided" });
    }

    await Process.findByIdAndDelete(processId);

    return res.status(200).json({ message: "Process deleted!" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/startProcess", async (req, res) => {
  try {
    const { userId, taskId, duration } = req.body;
    const user = await User.findById(userId);
    const task = await Task.findById(taskId);

    console.log("Running proccess:", taskId);

    if (!user || !task)
      return res.status(404).json({ error: "User or Task not found!" });

    const process = await Process.findOne({ userId });

    if (process) {
      return res.status(400).json({ error: "A process is already running" });
    }

    const newProcess = new Process({
      userId,
      taskId,
      duration,
      progress: 0,
      completed: false,
    });
    await newProcess.save();

    res.status(201).json({ message: "Process started", process: newProcess });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/updateProgress", async (req, res) => {
  try {
    const { processId, progress } = req.body;

    // Find the process and update its progress
    const updatedProcess = await Process.findByIdAndUpdate(
      processId,
      { progress, completed: progress === 100 },
      { new: true }
    );

    if (!updatedProcess) {
      return res.status(404).json({ message: "Process not found" });
    }

    res
      .status(200)
      .json({ message: "Progress updated", process: updatedProcess });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/complete", async (req, res) => {
  try {
    const { processId } = req.body;

    const completedProcess = await Process.findById(processId);

    console.log(completedProcess);
    console.log(processId);

    const task = await Task.findById(completedProcess.taskId);

    if (!task) {
      return res.status(404).json({ error: "Couldn't find task!" });
    }

    const user = await User.findByIdAndUpdate(
      completedProcess.userId,
      {
        $inc: {
          exp: task.exp,
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "Couldn't find user!" });
    }

    if (!completedProcess) {
      return res.status(404).json({ message: "Process not found" });
    }

    return res.status(200).json({
      message: "Task completed",
      process: completedProcess,
      newExp: user.exp,
    });
  } catch (error) {
    console.error("Error completing process:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/process", async (req, res) => {
  try {
    const { userId } = req.query;

    const process = await Process.find({ userId }).populate(
      "taskId",
      "title exp _length"
    );

    if (!process) {
      return res.status(404).json({ error: "No processes were found!" });
    }

    return res.status(200).json(process);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateTask = req.body;

    console.log(updateTask);

    await Task.findByIdAndUpdate(id, updateTask, { new: true });

    res.status(200).send("Data Updated Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (id) {
      await Task.findByIdAndDelete(id);
      res.status(200).send("Deleted!");
    } else {
      res.status(404).send("Not found!");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findById(id);

    res.send(task);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
