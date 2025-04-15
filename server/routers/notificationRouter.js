const router = require("express").Router();
//const auth = require("../middleware/auth");
const Notification = require("../models/notificationModel");

// Add your routes
//router.use(auth); // Middleware

router.get("/", async (req, res) => {
    try {
        const notifications = await Notification.find();

        if (notifications.length > 0) {
            return res.status(200).json(notifications);
        } else {
            return res.sendStatus(204);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/currentUserNotification", async (req, res) => {
    try {
        const { _id } = req.body;

        // Validate the presence of _id
        if (!_id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Aggregation pipeline to get notifications with sender user data
        const notifications = await Notification.aggregate([
            {
                $match: { receiverId: _id }, // Match notifications for the specified user
            },
            {
                $lookup: {
                    from: "users", // The name of the users collection
                    let: { searchId: { $toObjectId: "$senderId" } }, // Convert senderId to ObjectId
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$searchId"], // Match _id in users with the converted senderId
                                },
                            },
                        },
                        {
                            $project: {
                                username: 1,
                                avatar: 1, // Include only the fields you need
                            },
                        },
                    ],
                    as: "senderData", // New array field to be added with sender data
                },
            },
            {
                $unwind: "$senderData", // Unwind the senderData array
            },
            {
                $project: {
                    senderId: 1,
                    receiverId: 1,
                    senderUsername: "$senderData.username",
                    senderAvatar: "$senderData.avatar",
                    title: 1,
                    body: 1,
                    date: 1,
                    read: 1,
                },
            },
        ]);

        res.json(notifications);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.put("/update", async (req, res) => {
    const data = req.body;

    const result = await Notification.findByIdAndUpdate(data._id, data);

    res.send({ message: "OK" });
});

// Export the router
module.exports = router;
