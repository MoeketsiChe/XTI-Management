const express = require("express");
const pool = require("../db");

const router = express.Router();

// GET all users (the password is never sent back)
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, membership_id, role, created_at FROM users ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST login
router.post("/login", async (req, res) => {
  const { membership_id, password } = req.body;
  if (!membership_id || !password) {
    return res
      .status(400)
      .json({ error: "Membership ID and password are required" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT id, name, membership_id, role FROM users WHERE membership_id = ? AND password = ?",
      [membership_id, password]
    );
    if (rows.length === 0) {
      return res
        .status(401)
        .json({ error: "Invalid membership ID or password" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add a user
router.post("/", async (req, res) => {
  const { name, membership_id, password, role } = req.body;
  if (!name || !membership_id || !password) {
    return res
      .status(400)
      .json({ error: "Name, membership ID and password are required" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO users (name, membership_id, password, role) VALUES (?, ?, ?, ?)",
      [name, membership_id, password, role || "member"]
    );
    res.status(201).json({
      id: result.insertId,
      name,
      membership_id,
      role: role || "member",
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ error: "This membership ID already exists" });
    }
    res.status(500).json({ error: err.message });
  }
});

// PUT update a user (the password only changes if a new one is sent)
router.put("/:id", async (req, res) => {
  const { name, membership_id, role, password } = req.body;
  if (!name || !membership_id) {
    return res
      .status(400)
      .json({ error: "Name and membership ID are required" });
  }

  try {
    const sql = password
      ? "UPDATE users SET name = ?, membership_id = ?, role = ?, password = ? WHERE id = ?"
      : "UPDATE users SET name = ?, membership_id = ?, role = ? WHERE id = ?";
    const params = password
      ? [name, membership_id, role, password, req.params.id]
      : [name, membership_id, role, req.params.id];

    const [result] = await pool.query(sql, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User updated" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ error: "This membership ID already exists" });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE a user
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;