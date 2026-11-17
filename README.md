# XTI Library Management System

A full-stack library management system. Staff can manage books, track stock levels, record transactions (adding stock and borrowing), and manage users with role-based access.

## Tech Stack

- **Frontend:** React (Vite), React Router, React Hooks, CSS
- **Backend:** Node.js, Express.js (REST API)
- **Database:** MySQL (via XAMPP)
- **Communication:** Fetch API (React -> Express -> MySQL)

## Features

- Login with role-based access (admin, librarian, member)
- Dashboard showing book availability, with low-stock highlighting (fewer than 2 copies)
- Add, update and delete books
- Record transactions: add stock and borrow, with a full history log
- Add, update and delete users (admin only)

## Project Structure

```
XTI-management/
├── frontend/   React app
└── backend/    Express API + database script
```

## How to Run

### 1. Start MySQL
Open the XAMPP Control Panel and start **MySQL** (and **Apache** for phpMyAdmin).

### 2. Create the database
1. Open http://localhost/phpmyadmin
2. Click the **SQL** tab
3. Paste the contents of `backend/database.sql` and click **Go**

### 3. Set up the backend
```bash
cd backend
npm install
```
Create a file named `.env` inside `backend/` (copy `.env.example`):
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=library_db
PORT=5000
```
Then start the server:
```bash
npm run dev
```
The API runs at http://localhost:5000

### 4. Set up the frontend
In a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the address shown in the terminal (usually http://localhost:5173).

## Login

| Role  | Membership ID | Password |
|-------|---------------|----------|
| Admin | ADMIN001      | admin123 |

The admin can create librarian and member accounts on the Users page.

## API Endpoints

| Resource     | Routes |
|--------------|--------|
| Books        | `GET /books`, `GET /books/:id`, `POST /books`, `PUT /books/:id`, `DELETE /books/:id` |
| Users        | `GET /users`, `POST /users`, `POST /users/login`, `PUT /users/:id`, `DELETE /users/:id` |
| Transactions | `GET /transactions`, `POST /transactions` |

## Notes

- Passwords are stored as plain text for this class project. A production system would hash them (for example with bcrypt).
- Recording a transaction updates the stock and the history together in one database transaction, so they cannot get out of sync.