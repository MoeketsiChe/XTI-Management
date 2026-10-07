# XTI Library Management System

A web-based library management system for a community library, built with React.
Data is saved in the browser's localStorage.

## Features
- **Books:** add, update and delete books (title, author, genre, ISBN, quantity)
- **Availability:** track stock; record transactions to add stock or deduct stock when books are borrowed
- **Dashboard:** book availability table with low-stock highlighting (fewer than 2 copies), plus live stats and search
- **Transactions:** add/borrow forms and a full transaction history log
- **Users:** login, plus admin forms to add, update and delete users (name, membership ID, role)
- **Roles:** admin (everything), librarian (dashboard, books, transactions), member (dashboard only)

## Tech
React (JSX, hooks, Router), Vite, CSS, localStorage

## React concepts demonstrated
- `useState`, `useEffect`, `useContext`, and a custom `useLocalStorage` hook
- Component composition (BookForm, BookTable, UserForm, UserTable, Navbar, ProtectedRoute)
- Controlled forms with validation
- React Router with protected, role-based routes

## Run locally
    npm install
    npm run dev
Then open http://localhost:5173

## Demo login
- Membership ID: `ADMIN001`
- Password: `admin123`

## Notes
Passwords are stored as plain text in localStorage because this is a classroom demo with no backend. A real system would hash passwords on a server.

## Author
[Moeketsi Cheoane], [901020524], [Information Technology]
