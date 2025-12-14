import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",       
    "https://task-diary-a-to-do-dashboard.vercel.app"
  ],
  credentials: true
}));

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// --------- Mongo Connect ----------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo connected"))
  .catch(err => console.log("Mongo connect err:", err));

// --------- Schemas ----------
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
}, { timestamps: true });

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  completed: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
const Task = mongoose.model("Task", TaskSchema);

// --------- Middleware ----------
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(401).json({ msg: "Invalid token" });
    req.user = payload;
    next();
  });
};

// --------- Routes ----------

app.get("/", (req, res) => res.json({ msg: "Server is working correctly" }));

// Signup
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "Missing fields" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "Email already in use" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    res.json({ msg: "User created", user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "Missing fields" });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Wrong password" });
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "8h" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get profile
app.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// TASKS CRUD
// GET tasks
app.get("/tasks", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

app.post("/tasks", auth, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ msg: "Title required" });
    const task = await Task.create({ userId: req.user.id, title });
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// UPDATE task
app.put("/tasks/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const upd = await Task.findOneAndUpdate({ _id: id, userId: req.user.id }, req.body, { new: true });
    if (!upd) return res.status(404).json({ msg: "Task not found" });
    res.json(upd);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// DELETE task
app.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findOneAndDelete({ _id: id, userId: req.user.id });
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Start
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
