const router = require("express").Router();
const auth = require("../middleware/auth");
const Task = require("../models/taskModel");

router.get("/", auth, async (req, res) => {
    try {
        const tasks = await Task.find();

        res.send(tasks);
    } catch (err) {
        console.error(err);
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

router.post("/new", auth, async (req, res) => {
    try {
        const { title, description, exp, tutorial } = req.body;

        await Task.create({
            title,
            description,
            exp,
            tutorial,
        });
    } catch (error) {
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

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const updateTask = req.body;

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

module.exports = router;
