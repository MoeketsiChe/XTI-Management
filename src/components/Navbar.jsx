import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        XTI<span>LIBRARY</span>
      </div>
      <nav>
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/books">Books</NavLink>
        <NavLink to="/transactions">Transactions</NavLink>
        <NavLink to="/users">Users</NavLink>
        <NavLink to="/login">Login</NavLink>
      </nav>
    </aside>
  );
}