import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection, addDoc, onSnapshot, query,
  where, doc, updateDoc, deleteDoc
} from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
      if (!currentUser) navigate("/");
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db,"tasks"),
      where("userId","==",user.uid)
    );

    return onSnapshot(q, snap =>
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );
  }, [user]);

  const addTask = async () => {
    if (!task.trim()) return;

    if (!user) return;

    await addDoc(collection(db,"tasks"), {
      text: task,
      status: "pending",
      userId: user.uid,
      createdAt: new Date()
    });

    setTask("");
  };

  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const done = tasks.filter(t=>t.status==="done").length;
  const pending = tasks.length - done;

  const chartData = {
    labels: ["Completed","Pending"],
    datasets: [{
      data: [done, pending],
      backgroundColor: ["#22c55e","#f97316"]
    }]
  };

  const filteredTasks = tasks.filter(t =>
    filter==="all" ? true : t.status===filter
  );

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex justify-center items-start pt-8">
      <div className="w-full max-w-4xl">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Execution Tracker</h1>
            <p className="text-purple-300 text-sm mt-1">Stay organized and track your progress</p>
          </div>
          <button 
            onClick={logout} 
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* STATS CARDS */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 shadow-lg">
            <p className="text-blue-100 text-sm font-semibold mb-2">TOTAL TASKS</p>
            <p className="text-white text-4xl font-bold">{tasks.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-6 shadow-lg">
            <p className="text-green-100 text-sm font-semibold mb-2">COMPLETED</p>
            <p className="text-white text-4xl font-bold">{done}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg p-6 shadow-lg">
            <p className="text-amber-100 text-sm font-semibold mb-2">PENDING</p>
            <p className="text-white text-4xl font-bold">{pending}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* MAIN CONTENT - ADD TASK (2/3) */}
          <div className="col-span-2">
            <div className="bg-white rounded-xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Task</h2>
              
              <div className="flex gap-3 mb-6">
                <input
                  value={task}
                  onChange={e=>setTask(e.target.value)}
                  onKeyDown={e=>e.key==="Enter" && addTask()}
                  className="flex-1 border-2 border-purple-200 rounded-lg px-4 py-4 text-lg focus:outline-none focus:border-purple-500 transition"
                  placeholder="What's your next task? 🎯"
                />
                <button 
                  onClick={addTask} 
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-8 py-4 rounded-lg font-bold transition shadow-lg"
                >
                  Add Task
                </button>
              </div>

              {/* FILTER BUTTONS */}
              <div className="flex gap-3 mb-6">
                {["all","pending","done"].map(f=>(
                  <button
                    key={f}
                    onClick={()=>setFilter(f)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      filter===f
                        ?"bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg"
                        :"bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* TASKS LIST */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredTasks.length === 0 ? (
                  <p className="text-center text-gray-400 py-8 text-lg">No tasks here 🚀</p>
                ) : (
                  filteredTasks.map(t=>(
                    <div 
                      key={t.id} 
                      className={`flex justify-between items-center p-4 rounded-lg border-2 transition ${
                        t.status === "done"
                          ? "bg-gray-50 border-gray-200"
                          : "bg-white border-purple-200 hover:border-purple-400"
                      }`}
                    >
                      <span className={`text-lg ${t.status==="done"?"line-through text-gray-400":"text-gray-800 font-medium"}`}>
                        {t.text}
                      </span>
                      <div className="flex gap-3">
                        {t.status!=="done" && (
                          <button
                            onClick={()=>updateDoc(doc(db,"tasks",t.id),{status:"done"})}
                            className="bg-green-100 hover:bg-green-200 text-green-700 font-semibold px-3 py-1 rounded-lg transition"
                          >
                            ✓ Done
                          </button>
                        )}
                        <button
                          onClick={()=>deleteDoc(doc(db,"tasks",t.id))}
                          className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold px-3 py-1 rounded-lg transition"
                        >
                          ✕ Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* CHART SECTION (1/3) */}
          <div className="bg-white rounded-xl shadow-xl p-6 h-fit">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Progress</h3>
            <div className="w-full h-64 flex items-center justify-center">
              <Pie data={chartData} options={{ maintainAspectRatio: false, responsive: true }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
