const express = require("express");
const pool = require("../db");

const router = express.Router();

// GET all books
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM books ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET one book
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM books WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) return res.status(404).json({ error: "Book not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add a book
router.post("/", async (req, res) => {
  const { title, author, genre, isbn, quantity } = req.body;
  if (!title || !author || !isbn) {
    return res.status(400).json({ error: "Title, author and ISBN are required" });
  }
  try {
    const [result] = await pool.query(
      "INSERT INTO books (title, author, genre, isbn, quantity) VALUES (?, ?, ?, ?, ?)",
      [title, author, genre || null, isbn, quantity || 0]
    );
    res.status(201).json({ id: result.insertId, title, author, genre, isbn, quantity: quantity || 0 });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "A book with this ISBN already exists" });
    }
    res.status(500).json({ error: err.message });
  }
});

// PUT update a book
router.put("/:id", async (req, res) => {
  const { title, author, genre, isbn, quantity } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE books SET title = ?, author = ?, genre = ?, isbn = ?, quantity = ? WHERE id = ?",
      [title, author, genre, isbn, quantity, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Book not found" });
    res.json({ message: "Book updated" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "A book with this ISBN already exists" });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE a book
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM books WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Book not found" });
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;