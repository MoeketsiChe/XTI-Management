import { useState } from "react";
import { useLibrary } from "../context/LibraryContext";

export default function Transactions() {
  const { books, transactions, adjustStock } = useLibrary();
  const [bookId, setBookId] = useState("");
  const [type, setType] = useState("add");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState(null);

  const selected = books.find((b) => String(b.id) === bookId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bookId) {
      setMessage({ ok: false, text: "Please select a book" });
      return;
    }
    const result = adjustStock(Number(bookId), type, amount);
    if (result.ok) {
      setMessage({
        ok: true,
        text: type === "add" ? `Added ${amount} copies to stock` : `${amount} copies borrowed`,
      });
      setAmount("");
    } else {
      setMessage({ ok: false, text: result.error });
    }
  };

  return (
    <section>
      <p className="eyebrow">Stock control</p>
      <h1>Transactions</h1>

      <form onSubmit={handleSubmit} noValidate style={{ marginTop: "1.5rem" }}>
        <div>
          <label htmlFor="book">Book</label>
          <select id="book" value={bookId} onChange={(e) => { setBookId(e.target.value); setMessage(null); }}>
            <option value="">Select a book</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title} ({b.quantity} in stock)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="type">Action</label>
          <select id="type" value={type} onChange={(e) => { setType(e.target.value); setMessage(null); }}>
            <option value="add">Add stock (new books arrived)</option>
            <option value="borrow">Borrow (deduct stock)</option>
          </select>
        </div>
        <div>
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            min="1"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setMessage(null); }}
          />
        </div>
        <button type="submit">Record transaction</button>
      </form>

      {selected && <p className="hint-line">Current stock of "{selected.title}": {selected.quantity}</p>}
      {message && <p className={message.ok ? "message ok" : "message bad"}>{message.text}</p>}

      <h2>Transaction History</h2>
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Book</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td>{new Date(t.date).toLocaleString()}</td>
                  <td>{t.title}</td>
                  <td>
                    <span className={t.type === "add" ? "badge add" : "badge borrow"}>
                      {t.type === "add" ? "Stock added" : "Borrowed"}
                    </span>
                  </td>
                  <td>{t.type === "add" ? `+${t.amount}` : `-${t.amount}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}