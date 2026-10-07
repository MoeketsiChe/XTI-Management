import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const LibraryContext = createContext(null);

export function LibraryProvider({ children }) {
  const [books, setBooks] = useLocalStorage("books", []);
  const [transactions, setTransactions] = useLocalStorage("transactions", []);

  const logTransaction = (book, type, amount) => {
    setTransactions((prev) => [
      {
        id: Date.now() + Math.random(),
        bookId: book.id,
        title: book.title,
        type, // "add" or "borrow"
        amount,
        date: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const addBook = (data) => {
    const book = { ...data, id: Date.now(), quantity: Number(data.quantity) };
    setBooks((prev) => [...prev, book]);
    if (book.quantity > 0) logTransaction(book, "add", book.quantity);
  };

  // Quantity changes only through adjustStock, so the history stays accurate
  const updateBook = (id, data) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...data, quantity: b.quantity } : b))
    );
  };

  const deleteBook = (id) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  const adjustStock = (bookId, type, amount) => {
    const book = books.find((b) => b.id === bookId);
    const qty = Number(amount);
    if (!book) return { ok: false, error: "Book not found" };
    if (!Number.isInteger(qty) || qty <= 0)
      return { ok: false, error: "Enter a whole number greater than 0" };
    if (type === "borrow" && qty > book.quantity)
      return { ok: false, error: `Only ${book.quantity} in stock` };

    const change = type === "add" ? qty : -qty;
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, quantity: b.quantity + change } : b))
    );
    logTransaction(book, type, qty);
    return { ok: true };
  };

  const value = { books, transactions, addBook, updateBook, deleteBook, adjustStock };

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  return useContext(LibraryContext);
}