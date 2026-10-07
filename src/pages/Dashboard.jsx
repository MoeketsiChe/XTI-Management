import { useState } from "react";
import { useLibrary } from "../context/LibraryContext";

export default function Dashboard() {
  const { books } = useLibrary();
  const [search, setSearch] = useState("");

  const totalTitles = books.length;
  const totalCopies = books.reduce((sum, b) => sum + b.quantity, 0);
  const lowStock = books.filter((b) => b.quantity === 1).length;
  const outOfStock = books.filter((b) => b.quantity === 0).length;
  const needsAttention = lowStock + outOfStock;

  const filtered = books.filter((b) =>
    `${b.title} ${b.author} ${b.genre} ${b.isbn}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const statusOf = (qty) => {
    if (qty === 0) return <span className="badge out">Out of stock</span>;
    if (qty < 2) return <span className="badge low">Low stock</span>;
    return <span className="badge">In stock</span>;
  };

  return (
    <section>
      <div className="page-head">
        <div>
          <p className="eyebrow">Library Management System</p>
          <h1>Good day, Librarian.</h1>
        </div>
        <input
          className="search"
          type="search"
          placeholder="Search library..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="hero">
        <div>
          <p className="eyebrow" style={{ color: "var(--muted)" }}>Library status</p>
          <h2>
            {needsAttention === 0 ? (
              <>Everything is <span>under control.</span></>
            ) : (
              <>Some books <span>need restocking.</span></>
            )}
          </h2>
        </div>
        <div className="hero-count">
          <strong>{totalTitles}</strong>
          <p className="eyebrow" style={{ color: "var(--muted)" }}>Book titles</p>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <p className="label">Available copies</p>
          <p className="number">{totalCopies}</p>
        </div>
        <div className="stat alert">
          <p className="label">Low stock</p>
          <p className="number">{lowStock}</p>
          <p className="hint">Fewer than 2 copies</p>
        </div>
        <div className="stat alert">
          <p className="label">Out of stock</p>
          <p className="number">{outOfStock}</p>
        </div>
      </div>

      <p className="eyebrow" style={{ marginTop: "2.5rem" }}>Library inventory</p>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>Book Availability</h1>

      {filtered.length === 0 ? (
        <p>No books to show. Add some on the Books page.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Copies</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className={b.quantity < 2 ? "low" : ""}>
                  <td>{b.title}</td>
                  <td>{b.author}</td>
                  <td>{b.genre}</td>
                  <td>{b.quantity}</td>
                  <td>{statusOf(b.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}