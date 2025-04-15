const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const queryOptions = require("../queryOptions");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

router.get("/", async (req, res) => {
  try {
    const queries = req.query;
    const { query, sortOptions, skip, limit, page } = queryOptions(queries);

    // Fetch total user count for pagination metadata
    const totalUsers = await User.countDocuments(query);

    // Fetch paginated users
    const allUsers = await User.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      users: allUsers,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "An internal server error has occurred...",
    });
  }
});

router.post("/multipleUsers", async (req, res) => {
  try {
    const users = req.body;

    console.log(users);
    const userIds = users.map((user) => user.userId);

    const result = await User.find({ _id: { $in: userIds } });

    if (result) {
      const UserDTO = result.map(({ passwordHash, __v, ...user }) => user._doc);

      return res.send(UserDTO);
    }

    return res.status(400).send({ error: "No user was found" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: err });
  }
});

// Register user
router.post("/register", async (req, res) => {
  try {
    const { username, password, passwordAgain, email } = req.body;

    console.log(username, password, passwordAgain);

    // Validating user data
    if (!username || !password || !passwordAgain || !email) {
      return res.status(400).json({ error: "Fill all required fields!" });
    }

    if (password.length < 8 && password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters!" });
    }

    if (password !== passwordAgain) {
      return res.status(400).json({ error: "Passwords must match!" });
    }

    existingUser = await User.findOne({ username });
    if (existingUser?.username) {
      return res.status(400).json({ error: "Username already taken!" });
    }

    // Hashing password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Saving user to database

    await User.create({
      email,
      username,
      passwordHash,
      exp: 0,
      lvl: 1,
      avatar: "default.jpg",
      taskToday: [],
      banner: "bg-red-400",
      friendships: [],
      status: "online",
    });

    // Set token for user
    const newUser = await User.findOne({ username });
    const token = jwt.sign({ user: newUser.id }, process.env.JWT_SECRET);

    // Set token for cookie
    return res
      .cookie("token", token, { httpOnly: true })
      .send("User Created Successfully");
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      error: "An internal server error has occurred...",
    });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Fill all required fields!" });
    }

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res.status(401).json({ error: "Wrong username or password!" });
    }

    const passwordCompare = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );

    if (!passwordCompare) {
      return res.status(401).json({ error: "Wrong username of password!" });
    }

    console.log(existingUser);

    if (existingUser.status === "deleted") {
      return res.status(401).json({ error: "This account is deleted." });
    }

    existingUser.status = "online";
    await existingUser.save();

    // Set token for user
    const token = jwt.sign({ user: existingUser.id }, process.env.JWT_SECRET);

    console.log(token);

    // Set token for cookie
    res
      .cookie("token", token, { httpOnly: true })
      .send("User Logged In Successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

router.post("/restorePassword", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ Error: "User not found with this email!" });

    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 15 * 50 * 1000;

    user.resetToken = token;
    user.resetTokenExpiry = tokenExpiry;

    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    console.log(process.env.EMAIL_USER);
    console.log(process.env.EMAIL_PASS);

    const transporter = nodemailer.createTransport({
      host: "smtp.mailersend.net", // Mailersend SMTP server
      port: 587, // Use port 587 for TLS or port 465 for SSL
      auth: {
        user: process.env.EMAIL_USER, // Your Mailersend email address or API key
        pass: process.env.EMAIL_PASS, // Your Mailersend API key
      },
      secure: false, // Use TLS (set to true if using port 465)
      tls: {
        rejectUnauthorized: false, // Allows sending email without certificate issues (commonly needed for self-signed certificates)
      },
    });
    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset",
      html: `<p>Click <a target="_blank" href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
    });
    return res.json({ message: "Password reset link sent to your email!" });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500).json({ Error: "Internal Server Error" });
  }
});

router.post("/restoreAccount", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ Error: "User not found with this email!" });

    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 15 * 50 * 1000;

    user.resetToken = token;
    user.resetTokenExpiry = tokenExpiry;

    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reactivate-account/${token}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.mailersend.net", // Mailersend SMTP server
      port: 587, // Use port 587 for TLS or port 465 for SSL
      auth: {
        user: process.env.EMAIL_USER, // Your Mailersend email address or API key
        pass: process.env.EMAIL_PASS, // Your Mailersend API key
      },
      secure: false, // Use TLS (set to true if using port 465)
      tls: {
        rejectUnauthorized: false, // Allows sending email without certificate issues (commonly needed for self-signed certificates)
      },
    });
    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reactivate Account",
      html: `<p>Click <a target="_blank" href="${resetLink}">here</a> to reactivate account. This link expires in 15 minutes.</p>`,
    });
    return res.json({ message: "Reactivation link sent to your email!" });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500).json({ Error: "Internal Server Error" });
  }
});

router.post("/reactivate-account", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) return res.status(401).json({ Error: "Invalid token" });

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ Error: "Invalid user or expired token" });
    }

    user.status = "offline";

    await user.save();

    return res.status(200).json({ message: "Activation successful!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password, passwordAgain } = req.body;
    console.log(password, passwordAgain);

    // Check if both passwords match
    if (password !== passwordAgain) {
      return res.status(401).send({ Error: "Passwords must match!" });
    }

    // Find the user by the reset token and ensure the token is still valid
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }, // Check if token is not expired
    });

    if (!user) {
      return res.status(400).json({ Error: "Invalid user or expired token" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt); // Hash password

    console.log("Salt:", salt); // Debugging logs
    console.log("New password hash:", passwordHash); // Debugging logs

    // Save the new password hash and clear the reset token
    user.passwordHash = passwordHash;
    user.resetToken = null;
    user.resetTokenExpiry = null;

    // Save the user with the updated password hash
    await user.save();

    // Send a success response
    res.json({ message: "Password reset successful!" });
  } catch (error) {
    console.error(error); // Log any errors that occur
    res.status(500).json({ Error: "Internal Server Error" });
  }
});

// Logout user
router.get("/logout/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).send({ message: "No Id was provided!" });
    }

    const user = await User.findById(id);

    if (!user) {
      res.status(404).send({ message: "User not found!" });
    }

    user.status = "offline";
    await user.save();

    res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
    res.send("User Logged Out Successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json({ Error: "Internal Server Error" });
  }
});

// Get all users

// Check if user is logged in
router.get("/loggedIn", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json(false);

    jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).send(true);
  } catch (err) {
    res.json(false);
  }
});

// Get logged in user
router.get("/loggedInUser", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.send("No user logged in!");

    const { user } = jwt.decode(token);

    const currentUser = await User.findById(user);

    currentUser.status = "online";
    await currentUser.save();

    const UserDTO = {
      _id: currentUser._id,
      email: currentUser.email,
      username: currentUser.username,
      exp: currentUser.exp,
      lvl: currentUser.lvl,
      taskToday: currentUser.taskToday,
      avatar: currentUser.avatar,
      friendships: currentUser.friendships,
      clan: currentUser.clan,
      banner: currentUser.banner,
      description: "",
      status: currentUser.status,
      isAdmin: currentUser.isAdmin,
    };

    res.status(200).json(UserDTO);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

// Add or Remove tasks for user
router.put("/addTaskToday", async (req, res) => {
  try {
    const { userId, taskId } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: { taskToday: taskId },
      },
      { new: true }
    ).populate("taskToday", "title exp _length");

    res.status(200).json({
      message: "Successfully Added Task To User",
      task: user.taskToday,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send("Couldn't process data: " + error);
  }
});

router.put("/removeTaskToday", async (req, res) => {
  try {
    const { userId, taskId, exp } = req.body;
    const { inProgress } = req.query;

    console.log(req.body);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const mongoose = require("mongoose");
    const taskObjectId = new mongoose.Types.ObjectId(taskId);

    // Find the first matching task and remove it
    const index = user.taskToday.findIndex((id) => id.equals(taskObjectId));
    if (index !== -1) {
      user.taskToday.splice(index, 1); // remove one instance
    } else {
      return res.status(400).json({ error: "Task not found in taskToday" });
    }

    console.log(inProgress);

    if (inProgress === "false") {
      console.log("subtract");
      user.exp -= exp;
    }

    // Save updated user
    await user.save();

    // Populate updated taskToday
    await user.populate("taskToday", "title exp _length");

    return res.status(200).json({
      message: "Successfully removed one instance!",
      task: user.taskToday,
      newExp: user.exp,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/updateUsername", async (req, res) => {
  try {
    const { _id, username } = req.body;

    console.log(_id, username);

    // Ensure that both _id and username are provided
    if (!_id || !username) {
      return res.status(400).send({ message: "ID and username are required." });
    }

    // Update the user's username
    const result = await User.findByIdAndUpdate(
      _id,
      { $set: { username: username } }, // Use $set to update the username field
      { new: true } // Return the updated document
    );

    console.log(result);

    if (result) {
      return res.status(200).send(result); // Successfully updated
    } else {
      return res.status(404).send({ message: "User not found" }); // User not found
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

router.put("/updateAvatar", async (req, res) => {
  try {
    const { _id, avatar } = req.body;

    console.log(_id, avatar);

    // Ensure that both _id and username are provided
    if (!_id || !avatar) {
      return res.status(400).send({ message: "ID and avatar are required." });
    }

    // Update the user's username
    const result = await User.findByIdAndUpdate(
      _id,
      { $set: { avatar: avatar } }, // Use $set to update the username field
      { new: true } // Return the updated document
    );

    console.log(result);

    if (result) {
      return res.status(200).send(result); // Successfully updated
    } else {
      return res.status(404).send({ message: "User not found" }); // User not found
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

router.put("/updateBanner", async (req, res) => {
  try {
    const { banner } = req.body;
    const { user: _id } = jwt.decode(req.cookies.token);

    // Ensure that both _id and username are provided
    if (!_id || !banner) {
      return res.status(400).send({ message: "ID and banner are required." });
    }

    // Update the user's username
    const result = await User.findByIdAndUpdate(
      _id,
      { $set: { banner: banner } }, // Use $set to update the username field
      { new: true } // Return the updated document
    );

    if (result) {
      return res.status(200).send(result); // Successfully updated
    } else {
      return res.status(404).send({ message: "User not found" }); // User not found
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

router.put("/newEmail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!id || !email) {
      return res.status(400).send({ error: "Email is required!" });
    }

    const result = await User.findByIdAndUpdate(id, { email });

    if (!result) {
      return res.status(400).send({ error: "Wrong user id or wrong email!" });
    }

    return res
      .status(200)
      .send({ message: "Email was changed successfully!", email });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.put("/newPassword/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!id || !password.password || !password.passwordAgain) {
      return res.status(400).send({ error: "Password is required!" });
    }

    if (password.password !== password.passwordAgain) {
      return res.status(402).send({ error: "Password must match!" });
    }

    const user = await User.findById(id);

    const passwordCompare = await bcrypt.compare(
      password.currentPassword,
      user.passwordHash
    );

    if (!passwordCompare) {
      return res.status(402).send({ error: "Wrong current password!" });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password.password, salt);

    user.passwordHash = passwordHash;
    await user.save();

    return res
      .status(200)
      .send({ message: "Password was changed successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.put("/deleteAccount/:id", async (req, res) => {
  try {
    const { id } = req.params;

    res.cookie("token", "", { httpOnly: true, expires: new Date(0) });

    await User.findByIdAndUpdate(id, { status: "deleted" });

    return res.send({ message: "Account deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

router.delete("/finishDay/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { taskToday: [] } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "Day finished!", task: user.taskToday });
  } catch (error) {
    console.log(err);
    res.status(500).send({ message: error.message });
  }
});

router.put("/lvlUp/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const lvl = req.body.nextLVL;

    await User.findByIdAndUpdate(id, { $set: { lvl } });

    res.status(200).send("Lvl set!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await User.findById(id);

    if (result) {
      return res.status(200).send(result);
    }
    return res.status(404).send({ message: "User not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
