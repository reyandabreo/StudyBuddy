"use client";

import {
  FaChartPie,
  FaClock,
  FaFolderOpen,
  FaDatabase,
} from "react-icons/fa";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const [folders, setFolders] = useState([]);
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setFolders([]);
      setActivities([]);
      setStats([]);
      // Optionally, redirect to login:
      // navigate("/login");
      return;
    }
    const fetchData = async () => {
      try {
        const folderRes = await axios.get("http://localhost:5000/api/folders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const folders = Array.isArray(folderRes.data) ? folderRes.data : [];
        setFolders(folders);

        // Activity logs simulation (replace this with actual DB fetch later)
        const allActivities = folders.map((folder) => ({
          type: "Folder Created",
          folderName: folder.name,
          timestamp: folder.createdAt || new Date().toISOString(),
        }));

        // Sort by timestamp (most recent first)
        const recent = allActivities
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 4);

        setActivities(recent);

        // Chart data: count folders per day (last 7 days)
        const today = new Date();
        const chartData = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const dateStr = date.toISOString().slice(0, 10);
          const count = folders.filter(
            (f) =>
              new Date(f.createdAt).toISOString().slice(0, 10) === dateStr
          ).length;
          return { date: dateStr, count };
        }).reverse();

        setStats(chartData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setFolders([]);
        setActivities([]);
        setStats([]);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="lg:ml-auto min-h-screen px-4 py-6 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h1 className="flex items-center gap-3 text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-300 text-transparent bg-clip-text drop-shadow mb-10">
          <MdOutlineDashboardCustomize className="text-pink-300 drop-shadow" size={36} />
          Your Personalized Dashboard
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Full width chart */}
          <div className="lg:col-span-3">
            <GlassCard>
              <SectionHeader icon={<FaChartPie />} title="Activity Overview" />
              {stats.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="date" stroke="#ccc" />
                    <YAxis allowDecimals={false} stroke="#ccc" />
                    <Tooltip
                      contentStyle={{
                        background: "#23234a",
                        border: "1px solid #facc15",
                        borderRadius: "0.5rem",
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        boxShadow: "0 2px 8px #0004"
                      }}
                      labelStyle={{
                        color: "#facc15",
                        fontWeight: "bold"
                      }}
                      itemStyle={{
                        color: "#fff"
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#facc15"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <PlaceholderBox text="No activity data available." />
              )}
            </GlassCard>
          </div>

          <GlassCard>
            <SectionHeader icon={<FaClock />} title="Recent Activity" />
            <ul className="text-sm text-white/70 space-y-3">
              {activities.length === 0 ? (
                <li className="text-white/50">No recent activity.</li>
              ) : (
                activities.map((a, i) => (
                  <li
                    key={i}
                    className="rounded bg-white/10 p-3 hover:bg-white/20 transition"
                  >
                    📁 {a.type}: <strong>{a.folderName}</strong>{" "}
                    <span className="block text-xs text-white/40 mt-1">
                      {new Date(a.timestamp).toLocaleString()}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </GlassCard>

          <GlassCard>
            <SectionHeader icon={<FaFolderOpen />} title="Your Folders" />
            {folders.length === 0 ? (
              <p className="text-white/50 text-sm">No folders created yet.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 text-sm">
                {folders.slice(0, 4).map((f) => (
                  <div
                    key={f.id}
                    className="rounded-lg bg-white/10 backdrop-blur-md text-center py-4 border border-white/20 hover:bg-white/20 transition"
                  >
                    {f.name}
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          <GlassCard>
            <SectionHeader icon={<FaDatabase />} title="Connected Data" />
            <ul className="text-sm text-white/70 space-y-3">
              <li className="bg-white/10 p-3 rounded">
                Total Folders: {folders.length}
              </li>
              <li className="bg-white/10 p-3 rounded">
                Total Notes:{" "}
                {folders.reduce((acc, f) => acc + (f.notes?.length || 0), 0)}
              </li>
              <li className="bg-white/10 p-3 rounded">
                Last Created:{" "}
                {folders.length > 0
                  ? new Date(
                      folders[folders.length - 1].createdAt
                    ).toLocaleString()
                  : "N/A"}
              </li>
            </ul>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

// Glass card component
function GlassCard({ children }) {
  return (
    <div className="backdrop-blur-md bg-white/10 border border-white/20 shadow-lg rounded-xl p-6 space-y-6">
      {children}
    </div>
  );
}

// Section header
function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-3 text-yellow-300 font-semibold text-lg">
      <div className="text-xl">{icon}</div>
      {title}
    </div>
  );
}

// Chart placeholder
function PlaceholderBox({ text }) {
  return (
    <div className="w-full h-64 rounded-lg border border-white/20 bg-white/5 flex items-center justify-center text-yellow-300 text-sm">
      {text}
    </div>
  );
}
