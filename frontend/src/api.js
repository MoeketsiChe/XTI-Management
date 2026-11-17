const API_URL = "http://localhost:5000";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data;
}

export const api = {
  // Books
  getBooks: () => request("/books"),
  addBook: (book) => request("/books", { method: "POST", body: JSON.stringify(book) }),
  updateBook: (id, book) =>
    request(`/books/${id}`, { method: "PUT", body: JSON.stringify(book) }),
  deleteBook: (id) => request(`/books/${id}`, { method: "DELETE" }),

  // Users
  login: (credentials) =>
    request("/users/login", { method: "POST", body: JSON.stringify(credentials) }),
  getUsers: () => request("/users"),
  addUser: (user) => request("/users", { method: "POST", body: JSON.stringify(user) }),
  updateUser: (id, user) =>
    request(`/users/${id}`, { method: "PUT", body: JSON.stringify(user) }),
  deleteUser: (id) => request(`/users/${id}`, { method: "DELETE" }),

  // Transactions
  getTransactions: () => request("/transactions"),
  addTransaction: (transaction) =>
    request("/transactions", { method: "POST", body: JSON.stringify(transaction) }),
};