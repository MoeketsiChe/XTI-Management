import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Transactions from "./pages/Transactions";
import Users from "./pages/Users";
import Login from "./pages/Login";

export default function App() {
  const { currentUser } = useAuth();
  const staff = ["admin", "librarian"];

  return (
    <div className={currentUser ? "layout" : "auth-layout"}>
      {currentUser && <Navbar />}
      <main className="content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/books" element={<ProtectedRoute roles={staff}><Books /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute roles={staff}><Transactions /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute roles={["admin"]}><Users /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}