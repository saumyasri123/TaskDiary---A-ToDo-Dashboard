import React from "react";
import { motion } from "framer-motion";

export default function StatsCard({ title, value, icon: Icon, color }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl shadow-lg text-white ${color} flex items-center justify-between`}
        >
            <div>
                <h3 className="text-lg font-medium opacity-90">{title}</h3>
                <p className="text-3xl font-bold mt-1">{value}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-full">
                <Icon size={28} />
            </div>
        </motion.div>
    );
}
