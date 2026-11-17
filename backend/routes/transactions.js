const express = require("express");
const pool = require("../db");

const router = express.Router();

// GET transaction history (with book title and user name)
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.id, t.type, t.quantity, t.created_at,
             b.title AS book_title, u.name AS user_name
      FROM transactions t
      JOIN books b ON t.book_id = b.id
      LEFT JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC, t.id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST record a transaction and update stock
router.post("/", async (req, res) => {
  const { book_id, user_id, type, quantity } = req.body;
  const qty = Number(quantity);

  if (!book_id || !["add", "borrow"].includes(type) || !Number.isInteger(qty) || qty <= 0) {
    return res.status(400).json({
      error: "book_id, a type of 'add' or 'borrow', and a positive whole quantity are required",
    });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [books] = await connection.query(
      "SELECT quantity FROM books WHERE id = ? FOR UPDATE",
      [book_id]
    );
    if (books.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Book not found" });
    }

    if (type === "borrow" && books[0].quantity < qty) {
      await connection.rollback();
      return res.status(400).json({
        error: `Not enough stock. Only ${books[0].quantity} available`,
      });
    }

    const change = type === "add" ? qty : -qty;
    await connection.query("UPDATE books SET quantity = quantity + ? WHERE id = ?", [
      change,
      book_id,
    ]);

    const [result] = await connection.query(
      "INSERT INTO transactions (book_id, user_id, type, quantity) VALUES (?, ?, ?, ?)",
      [book_id, user_id || null, type, qty]
    );

    await connection.commit();
    res.status(201).json({
      id: result.insertId,
      book_id,
      type,
      quantity: qty,
      new_stock: books[0].quantity + change,
    });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});

module.exports = router;