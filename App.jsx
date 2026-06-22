import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Leads from "./pages/Leads";
import Tasks from "./pages/Tasks";
import Meetings from "./pages/Meetings";

const API = "http://localhost:8000";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("crm_token"));
  const [activePage, setActivePage] = useState("dashboard");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Employee");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !password) return setError("All fields required!");
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Registration failed");
      alert("✅ Account created! Please login.");
      setIsRegisterMode(false); setUsername(""); setPassword("");
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed");
      // ✅ Store JWT + real username/role from backend DB
      localStorage.setItem("crm_token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);
      setIsLoggedIn(true);
    } catch (err) { setError("❌ " + err.message); }
    finally { setLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem("crm_token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.loginPageContainer}>
        <div style={styles.loginCard}>
          <h2 style={{ textAlign: "center", margin: "10px 0" }}>🚀 CRM 360 Login</h2>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: "20px" }}>Enterprise Resource Management Portal</p>
          {error && <div style={styles.errorBox}>{error}</div>}
          <form onSubmit={isRegisterMode ? handleRegister : handleLogin}>
            <label style={styles.label}>Username / Employee Name</label>
            <input placeholder="Enter name" value={username} onChange={(e) => setUsername(e.target.value)} style={styles.input} required />
            <label style={styles.label}>Security Password</label>
            <div style={{ position: "relative" }}>
              <input type={showPassword ? "text" : "password"} value={password} placeholder="••••••••" onChange={(e) => setPassword(e.target.value)} style={{ ...styles.input, paddingRight: "60px" }} required />
              <span onClick={() => setShowPassword(!showPassword)} style={styles.showBtn}>{showPassword ? "HIDE" : "SHOW"}</span>
            </div>
            {isRegisterMode && (
              <>
                <label style={styles.label}>Select Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.input}>
                  <option value="Admin (Full Access)">🛡️ Admin (Full Access)</option>
                  <option value="Manager">💼 Manager</option>
                  <option value="Employee">👤 Employee</option>
                </select>
              </>
            )}
            <button type="submit" style={styles.loginBtn} disabled={loading}>
              {loading ? "⏳ Please wait..." : (isRegisterMode ? "Create / Register Account" : "Secure Login")}
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: "15px", fontSize: "14px" }}>
            {isRegisterMode ? "Already have an account?" : "New Employee?"}
            <span style={{ color: "#0ea5e9", cursor: "pointer", marginLeft: "5px" }} onClick={() => { setIsRegisterMode(!isRegisterMode); setError(""); }}>
              {isRegisterMode ? "Login" : "Create Account"}
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f1f5f9" }}>
      <div style={{ width: "260px", flexShrink: 0 }}>
        <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={handleLogout} />
      </div>
      <main style={{ flex: 1, padding: "20px", overflowX: "hidden" }}>
        {activePage === "dashboard" && <Dashboard />}
        {activePage === "customers" && <Customers />}
        {activePage === "leads" && <Leads />}
        {activePage === "tasks" && <Tasks />}
        {activePage === "meetings" && <Meetings />}
      </main>
    </div>
  );
}

const styles = {
  loginPageContainer: { width: "100vw", height: "100vh", backgroundColor: "#0b0f19", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  loginCard: { backgroundColor: "white", padding: "40px", borderRadius: "12px", width: "400px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" },
  errorBox: { backgroundColor: "#fee2e2", color: "#991b1b", padding: "10px 14px", borderRadius: "6px", marginBottom: "16px", fontSize: "14px", fontWeight: "500" },
  input: { width: "100%", padding: "12px", margin: "8px 0 16px 0", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "14px" },
  label: { fontSize: "14px", fontWeight: "600", color: "#1e293b" },
  loginBtn: { width: "100%", padding: "12px", backgroundColor: "#0ea5e9", color: "white", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", marginTop: "10px", fontSize: "15px" },
  showBtn: { position: "absolute", right: "12px", top: "12px", cursor: "pointer", fontSize: "11px", color: "#0ea5e9", fontWeight: "bold" }
};

export default App;