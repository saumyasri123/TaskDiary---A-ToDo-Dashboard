import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";
import { format, subDays } from "date-fns";

const COLORS = ["#10B981", "#F59E0B"]; 

export default function TaskChart({ tasks }) {
    const completed = tasks.filter((t) => t.completed).length;
    const pending = tasks.length - completed;

    const statusData = [
        { name: "Completed", value: completed },
        { name: "Pending", value: pending },
    ];

    const activityData = [];
    for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dateStr = format(date, "MMM dd");
        const count = tasks.filter(
            (t) => format(new Date(t.createdAt), "MMM dd") === dateStr
        ).length;
        activityData.push({ date: dateStr, count });
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Task Status</h3>
                <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Activity (Last 7 Days)</h3>
                <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={activityData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis allowDecimals={false} />
                            <Tooltip cursor={{ fill: "#F3F4F6" }} />
                            <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
