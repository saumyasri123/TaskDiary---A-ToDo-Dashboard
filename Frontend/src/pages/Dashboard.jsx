import React, { useEffect, useState } from "react";
import { api, setAuthToken } from "../hooks/useAuth";
import TaskItem from "../components/TaskItem";
import StatsCard from "../components/StatsCard";
import TaskChart from "../components/TaskChart";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ListTodo, CheckCircle2, Clock, Activity, Search } from "lucide-react";
import { MdWavingHand } from "react-icons/md";
import { FaLightbulb } from "react-icons/fa";

export default function Dashboard() {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const token = localStorage.getItem("token");
  setAuthToken(token);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTitle.trim()) return;
    await api.post("/tasks", { title: newTitle });
    setNewTitle("");
    fetchTasks();
  };

  const filtered = tasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase())
  ).filter(t => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pt-24">


      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                Welcome back, {profile.name.split(" ")[0]}!
                <motion.div
                  whileHover={{ rotate: 20 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="inline-block"
                >
                  <MdWavingHand className="text-yellow-500 bg-transparent" size={32} />
                </motion.div>
              </h2>
              <p className="text-gray-500 mt-1">Here's what's happening with your tasks today.</p>
            </div>
            <div className="hidden sm:flex items-center gap-3 bg-white p-2 pr-4 rounded-full shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-900">{profile.name}</p>
                <p className="text-xs text-gray-500">{profile.email}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Tasks"
            value={totalTasks}
            icon={ListTodo}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatsCard
            title="Completed"
            value={completedTasks}
            icon={CheckCircle2}
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          <StatsCard
            title="Pending"
            value={pendingTasks}
            icon={Clock}
            color="bg-gradient-to-r from-amber-500 to-amber-600"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-indigo-600" />
            <h3 className="text-xl font-bold text-gray-800">Analytics</h3>
          </div>
          <TaskChart tasks={tasks} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <ListTodo className="text-indigo-500" size={20} /> My Tasks
                </h3>

                <div className="flex bg-gray-100 rounded-lg p-1">
                  {["all", "pending", "completed"].map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${filter === f
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-gray-50/50 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Search for a task..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Add a new task..."
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addTask()}
                  />
                  <button
                    onClick={addTask}
                    disabled={!newTitle.trim()}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                  >
                    <Plus size={20} /> Add
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <AnimatePresence mode="popLayout">
                  {filtered.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-12 text-gray-400"
                    >
                      <p>No tasks found.</p>
                    </motion.div>
                  ) : (
                    filtered.map(task => (
                      <TaskItem key={task._id} task={task} onRefresh={fetchTasks} />
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl -ml-12 -mb-12 pointer-events-none"></div>

              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">Pro Tip <FaLightbulb className="text-yellow-400" /></h3>
              <p className="text-indigo-200 text-sm leading-relaxed">
                Breaking down larger tasks into smaller sub-tasks helps maintain momentum and reduces procrastination.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
