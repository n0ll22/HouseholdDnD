const Friendship = require("../models/friendshipModel");
const auth = require("../middleware/auth");
const User = require("../models/userModel");
const queryOptions = require("../queryOptions");
const router = require("express").Router();
const mongoose = require("mongoose");

router.get("/getAccepted", async (req, res) => {
  try {
    const { friendshipIds } = req.query;

    const result = await Friendship.find({
      _id: { $in: friendshipIds },
    }).populate(["senderId", "receiverId"], "username avatar lvl");

    const filteredResult = result.filter((r) => r.status === "accepted");

    if (!result) {
      return res.status(204).send({ message: "No friendship was found!" });
    }

    return res.status(200).send(filteredResult);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/getPending", async (req, res) => {
  try {
    const { friendshipIds } = req.query;

    const result = await Friendship.find({
      _id: { $in: friendshipIds },
    }).populate(["senderId", "receiverId"], "username avatar lvl");

    const filteredResult = result.filter((r) => r.status === "pending");

    if (!result) {
      return res.status(204).send({ message: "No friendship was found!" });
    }

    return res.status(200).send(filteredResult);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const result = await Friendship.find().populate(
      ["senderId", "receiverId"],
      "username avatar lvl"
    );

    if (result.length === 0) {
      return res.status(204).send("No friendship was found!");
    }

    return res.status(200).send(result);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    const friendship = new Friendship({
      senderId,
      receiverId,
      status: "pending",
    });

    await friendship.save();

    const result = await Friendship.findById(friendship._id);

    if (result.length === 0) {
      return res.status(404).send("Couldn't create new friendship!");
    }

    await User.findByIdAndUpdate(senderId, {
      $push: { friendships: friendship._id },
    });
    await User.findByIdAndUpdate(receiverId, {
      $push: { friendships: friendship._id },
    });

    return res.status(201).send("Friendship created!");
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal Server Error", err });
  }
});

router.get("/getOneFriendship", auth, async (req, res) => {
  try {
    const { user1, user2 } = req.query;

    if (!user1 || !user2) {
      return res.status(400).send({ message: "Invalid or empty data" });
    }

    const result = await Friendship.findOne({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 },
      ],
    }).populate(["senderId", "receiverId"], "username avatar lvl");

    if (!result) {
      return res.status(204).send({ message: "No friendship was found!" });
    }

    const updatedFriendship = {
      _id: result._id,
      __v: result.__v,
      currentUser: result.receiverId,
      otherUser: result.senderId,
      status: result.status,
    };

    return res.status(200).send(updatedFriendship);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/getBlocked/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Friendship.find({
      $or: [
        { receiverId: new mongoose.Types.ObjectId(id) },
        { senderId: new mongoose.Types.ObjectId(id) },
      ],
      status: "blocked", // This should ensure only blocked friendships are returned
    }).populate("receiverId senderId", "username avatar");

    // No filter needed if query is correct:

    const filteredData = result.map((item) => {
      if (item.senderId._id.toString() === id) {
        return {
          currentUser: item.senderId,
          otherUser: item.receiverId,
          status: item.status,
          blockedBy: item.blockedBy,
          _id: item._id,
        };
      } else if (item.receiverId._id.toString() === id) {
        return {
          currentUser: item.receiverId,
          otherUser: item.senderId,
          status: item.status,
          blockedBy: item.blockedBy,
          _id: item._id,
        };
      }
      return null;
    });

    return res.status(200).json(filteredData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err });
  }
});

router.post("/getAllFriendshipForUser/:id", auth, async (req, res) => {
  try {
    const { friendshipIds } = req.body;
    const { id } = req.params;
    const queries = req.query;

    console.log(queries);

    const { skip, limit } = queryOptions(queries);

    const result = await Friendship.find({
      _id: { $in: friendshipIds },
    }).populate(["senderId", "receiverId"], "username avatar lvl status");

    if (!result || result.length === 0) {
      return res.status(204).send({ message: "No friendship was found!" });
    }

    const filteredData = result
      .map((item) => {
        if (item.senderId._id.toString() === id) {
          return {
            currentUser: item.senderId,
            otherUser: item.receiverId,
            status: item.status,
            _id: item._id,
          };
        } else if (item.receiverId._id.toString() === id) {
          return {
            currentUser: item.receiverId,
            otherUser: item.senderId,
            status: item.status,
            _id: item._id,
          };
        }
        return null;
      })
      .filter((item) => item !== null)
      .filter((f) =>
        f.otherUser.username
          .toLowerCase()
          .includes(queries.search.toLowerCase())
      )
      .sort((a, b) => {
        const comparison = a.otherUser.username
          .toLowerCase()
          .localeCompare(b.otherUser.username.toLowerCase());
        return queries.order === "desc" ? -comparison : comparison;
      })
      .slice(skip, skip + limit);

    console.log(filteredData);

    return res.status(200).send(filteredData);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Friendship.findById(id).populate(
      ["senderId", "receiverId"],
      "username avatar lvl status"
    );

    if (!result) {
      return res.status(204).send({ message: "No friendship was found!" });
    }

    return res.status(200).send(result);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
