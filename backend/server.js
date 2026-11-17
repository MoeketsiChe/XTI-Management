require("dotenv").config();
const express = require("express");
const cors = require("cors");

const booksRouter = require("./routes/books");
const usersRouter = require("./routes/users");
const transactionsRouter = require("./routes/transactions");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Library API running"));

app.use("/books", booksRouter);
app.use("/users", usersRouter);
app.use("/transactions", transactionsRouter);

app.listen(process.env.PORT, () =>
  console.log(`Server on http://localhost:${process.env.PORT}`)
);