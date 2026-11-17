import { useState } from "react";
import { useLibrary } from "../context/LibraryContext";
import BookForm from "../components/BookForm";
import BookTable from "../components/BookTable";

export default function Books() {
  const { books, addBook, updateBook, deleteBook } = useLibrary();
  const [editingBook, setEditingBook] = useState(null);

  const handleSubmit = (data) => {
    if (editingBook) {
      updateBook(editingBook.id, data);
      setEditingBook(null);
    } else {
      addBook(data);
    }
  };

  const handleDelete = (book) => {
    if (window.confirm(`Delete "${book.title}"?`)) {
      deleteBook(book.id);
      if (editingBook?.id === book.id) setEditingBook(null);
    }
  };

  return (
    <section>
      <p className="eyebrow">Library management</p>
      <h1>{editingBook ? "Update Book" : "Add New Book"}</h1>
      <BookForm
        key={editingBook ? editingBook.id : "new"}
        initialValues={editingBook ?? undefined}
        editingId={editingBook ? editingBook.id : null}
        existingBooks={books}
        submitLabel={editingBook ? "Save Changes" : "Add Book"}
        onSubmit={handleSubmit}
        onCancel={editingBook ? () => setEditingBook(null) : undefined}
      />

      <h2>All Books</h2>
      <BookTable books={books} onEdit={setEditingBook} onDelete={handleDelete} />
    </section>
  );
}