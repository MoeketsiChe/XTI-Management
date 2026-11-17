import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const canManage = currentUser.role === "admin" || currentUser.role === "librarian";

  return (
    <aside className="sidebar">
      <div className="brand">
        XTI<span>LIBRARY</span>
      </div>
      <nav>
        <NavLink to="/" end>Dashboard</NavLink>
        {canManage && <NavLink to="/books">Books</NavLink>}
        {canManage && <NavLink to="/transactions">Transactions</NavLink>}
        {currentUser.role === "admin" && <NavLink to="/users">Users</NavLink>}
      </nav>
      <div className="user-box">
        <p>{currentUser.name}</p>
        <small>{currentUser.role}</small>
        <button onClick={logout}>Logout</button>
      </div>
    </aside>
  );
}