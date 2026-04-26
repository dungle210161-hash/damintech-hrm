import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/* =====================================
   DAMINTECH HRM - UI POLISH VERSION
   (NO CHANGE LOGIC - ONLY DESIGN IMPROVEMENT)
===================================== */

const statusStyle = (status) => {
  if (status === "Rảnh") return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  if (status === "Đang làm") return "bg-sky-50 text-sky-700 border border-sky-200";
  if (status === "Trễ deadline") return "bg-rose-50 text-rose-700 border border-rose-200";
  return "bg-gray-100 text-gray-700";
};

const StatusBadge = ({ status }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle(status)}`}>
    {status}
  </span>
);

export default function Dashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const [page, setPage] = useState("employees");
  const [taskInput, setTaskInput] = useState({});
  const [fbInput, setFbInput] = useState({});

  const [employees, setEmployees] = useState([
    { id: 1, name: "Nguyễn Văn A", status: "Rảnh", task: "" },
    { id: 2, name: "Trần Thị B", status: "Đang làm", task: "Báo cáo KPI" },
    { id: 3, name: "Lê Văn C", status: "Trễ deadline", task: "Fix hệ thống" },
    { id: 4, name: "Phạm Thị D", status: "Đang làm", task: "UI Design" },
    { id: 5, name: "Hoàng Văn E", status: "Rảnh", task: "" }
  ]);

  const [feedbacks, setFeedbacks] = useState([]);

  const login = () => {
    if (user.trim() && pass.trim()) setLoggedIn(true);
  };

  const logout = () => {
    setLoggedIn(false);
    setUser("");
    setPass("");
  };

  const assignTask = (id) => {
    const task = taskInput[id];
    if (!task) return;
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: "Đang làm", task } : e));
    setTaskInput(p => ({ ...p, [id]: "" }));
  };

  const completeTask = (id) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: "Rảnh", task: "" } : e));
  };

  const sendFeedback = (emp) => {
    const msg = fbInput[emp.id];
    if (!msg) return;

    setFeedbacks(prev => [
      {
        id: Date.now(),
        name: emp.name,
        message: msg,
        date: new Date().toLocaleString(),
        source: "Quản lý nhân viên"
      },
      ...prev
    ]);

    setFbInput(p => ({ ...p, [emp.id]: "" }));
  };

  const weekly = feedbacks;
  const monthly = feedbacks;

  /* LOGIN */
  if (!loggedIn) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
        <Card className="w-96 shadow-xl rounded-2xl border-0">
          <CardContent className="p-8 space-y-4">
            <h1 className="text-2xl font-bold text-center text-blue-700">DaminTech HRM</h1>
            <p className="text-center text-sm text-gray-500">Hệ thống quản lý nhân sự</p>

            <input className="w-full border rounded-lg p-2" placeholder="Tài khoản" value={user} onChange={e => setUser(e.target.value)} />
            <input className="w-full border rounded-lg p-2" type="password" placeholder="Mật khẩu" value={pass} onChange={e => setPass(e.target.value)} />

            <Button onClick={login} className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg">
              Đăng nhập
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-slate-50">

      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-lg">
        <div className="p-6 border-b border-slate-700">
          <div className="text-xl font-bold">DaminTech</div>
          <div className="text-xs text-slate-300">Solar Energy HR System</div>
        </div>

        <nav className="flex-1 p-3 space-y-2">
          <button onClick={() => setPage("employees")} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800">
            👥 Quản lý nhân viên
          </button>
          <button onClick={() => setPage("feedback")} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800">
            💬 Phản hồi
          </button>
          <button onClick={() => setPage("reward")} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800">
            🏆 Khen thưởng
          </button>
        </nav>

        <button onClick={logout} className="m-3 px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600">
          Đăng xuất
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 overflow-auto">

        {/* EMPLOYEES */}
        {page === "employees" && (
          <Card className="rounded-2xl shadow-sm border-0">
            <CardContent className="p-0">
              {employees.map(emp => (
                <div key={emp.id} className="flex justify-between items-center p-5 border-b hover:bg-slate-50">

                  <div className="flex-1">
                    <div className="font-semibold text-slate-800">#{emp.id} {emp.name}</div>
                    <div className="text-xs text-slate-500">{emp.task || "Chưa có task"}</div>

                    <div className="flex gap-2 mt-3">
                      {emp.status === "Rảnh" && (
                        <>
                          <input className="border rounded-lg p-1 text-sm" value={taskInput[emp.id] || ""} onChange={e => setTaskInput(p => ({ ...p, [emp.id]: e.target.value }))} />
                          <Button onClick={() => assignTask(emp.id)}>Giao task</Button>
                        </>
                      )}

                      {emp.status === "Đang làm" && (
                        <Button onClick={() => completeTask(emp.id)} className="bg-emerald-600 hover:bg-emerald-700">
                          Hoàn thành
                        </Button>
                      )}

                      {emp.status === "Trễ deadline" && (
                        <div className="flex gap-2">
                          <input className="border rounded-lg p-1 text-sm" value={fbInput[emp.id] || ""} onChange={e => setFbInput(p => ({ ...p, [emp.id]: e.target.value }))} />
                          <Button onClick={() => sendFeedback(emp)} className="bg-rose-500 hover:bg-rose-600">
                            Gửi phản hồi
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <StatusBadge status={emp.status} />

                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* FEEDBACK */}
        {page === "feedback" && (
          <div className="grid grid-cols-2 gap-6">

            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-5">
                <h2 className="font-bold mb-4">Phản hồi hàng tuần</h2>
                {weekly.map(f => (
                  <div key={f.id} className="border-b py-3">
                    <div className="font-semibold">{f.name}</div>
                    <div className="text-xs text-slate-500">{f.date}</div>
                    <div className="text-sm mt-1">{f.message}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-5">
                <h2 className="font-bold mb-4">Phản hồi hàng tháng</h2>
                {monthly.map(f => (
                  <div key={f.id} className="border-b py-3">
                    <div className="font-semibold">{f.name}</div>
                    <div className="text-xs text-slate-500">{f.date}</div>
                    <div className="text-sm mt-1">{f.message}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>
        )}

        {/* REWARD (KEEP STRUCTURE) */}
        {page === "reward" && (
          <div className="space-y-4">

            <Card className="rounded-2xl shadow-sm border-0">
              <CardContent className="p-5">
                <h2 className="text-lg font-bold mb-4">🏆 Khen thưởng nhân viên</h2>

                <div className="grid gap-4">
                  <div className="p-4 rounded-xl bg-yellow-50 border">
                    <div className="font-semibold">Trần Thị B</div>
                    <div className="text-sm text-slate-600">Hoàn thành KPI sớm</div>
                    <div className="text-xs text-yellow-600 mt-1">MVP Tháng</div>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50 border">
                    <div className="font-semibold">Phạm Thị D</div>
                    <div className="text-sm text-slate-600">Cải tiến quy trình</div>
                    <div className="text-xs text-blue-600 mt-1">Rising Star</div>
                  </div>
                </div>

              </CardContent>
            </Card>

          </div>
        )}

      </main>
    </div>
  );
}
