import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { api } from "../api";

const LibraryContext = createContext(null);

// Convert a database row to the shape the pages use
const toTransaction = (t) => ({
  id: t.id,
  bookId: t.book_id,
  title: t.book_title,
  type: t.type, // "add" or "borrow"
  amount: t.quantity,
  date: t.created_at,
  userName: t.user_name,
});

export function LibraryProvider({ children }) {
  const { currentUser } = useAuth();
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      const [bookData, transactionData] = await Promise.all([
        api.getBooks(),
        api.getTransactions(),
      ]);
      setBooks(bookData);
      setTransactions(transactionData.map(toTransaction));
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data when someone logs in, clear it when they log out
  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      refresh();
    } else {
      setBooks([]);
      setTransactions([]);
    }
  }, [currentUser?.id, refresh]);

  const addBook = async (data) => {
    try {
      await api.addBook({
        title: data.title,
        author: data.author,
        genre: data.genre,
        isbn: data.isbn,
        quantity: Number(data.quantity) || 0,
      });
      await refresh();
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  };

  // Quantity changes only through adjustStock, so the history stays accurate
  const updateBook = async (id, data) => {
    const book = books.find((b) => b.id === id);
    if (!book) return { ok: false, error: "Book not found" };
    try {
      await api.updateBook(id, {
        title: data.title,
        author: data.author,
        genre: data.genre,
        isbn: data.isbn,
        quantity: book.quantity,
      });
      await refresh();
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  };

  const deleteBook = async (id) => {
    try {
      await api.deleteBook(id);
      await refresh();
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  };

  const adjustStock = async (bookId, type, amount) => {
    const book = books.find((b) => b.id === bookId);
    const qty = Number(amount);
    if (!book) return { ok: false, error: "Book not found" };
    if (!Number.isInteger(qty) || qty <= 0)
      return { ok: false, error: "Enter a whole number greater than 0" };
    if (type === "borrow" && qty > book.quantity)
      return { ok: false, error: `Only ${book.quantity} in stock` };

    try {
      await api.addTransaction({
        book_id: bookId,
        user_id: currentUser?.id,
        type,
        quantity: qty,
      });
      await refresh();
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  };

  const value = {
    books,
    transactions,
    loading,
    error,
    addBook,
    updateBook,
    deleteBook,
    adjustStock,
  };

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  return useContext(LibraryContext);
}