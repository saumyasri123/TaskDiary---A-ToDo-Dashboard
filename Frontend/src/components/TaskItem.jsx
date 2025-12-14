import React, { useState } from "react";
import { api, setAuthToken } from "../hooks/useAuth";
import { motion } from "framer-motion";
import { Check, Edit2, Trash2, X, Save } from "lucide-react";

export default function TaskItem({ task, onRefresh }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const token = localStorage.getItem("token");
  setAuthToken(token);

  const toggle = async () => {
    await api.put(`/tasks/${task._id}`, { completed: !task.completed });
    onRefresh();
  };

  const save = async () => {
    if (!title.trim()) return;
    await api.put(`/tasks/${task._id}`, { title });
    setEditing(false);
    onRefresh();
  };

  const remove = async () => {
    await api.delete(`/tasks/${task._id}`);
    onRefresh();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      className={`p-4 rounded-xl shadow-sm border transition-colors flex items-center justify-between ${task.completed ? "bg-gray-50 border-gray-200" : "bg-white border-gray-100"
        }`}
    >
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={toggle}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed
              ? "bg-green-500 border-green-500 text-white"
              : "border-gray-300 hover:border-green-500"
            }`}
        >
          {task.completed && <Check size={14} strokeWidth={3} />}
        </button>

        {editing ? (
          <input
            autoFocus
            className="border-b-2 border-blue-500 bg-transparent focus:outline-none flex-1 text-gray-700 px-1 py-0.5"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
          />
        ) : (
          <span
            className={`text-base font-medium transition-all ${task.completed ? "text-gray-400 line-through" : "text-gray-700"
              }`}
          >
            {task.title}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 ml-4">
        {editing ? (
          <>
            <button
              onClick={save}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Save"
            >
              <Save size={18} />
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setTitle(task.title);
              }}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              title="Cancel"
            >
              <X size={18} />
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 size={18} />
          </button>
        )}
        <button
          onClick={remove}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </motion.div>
  );
}
