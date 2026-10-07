import { useState } from "react";

const emptyBook = { title: "", author: "", genre: "", isbn: "", quantity: "" };

export default function BookForm({
  initialValues = emptyBook,
  onSubmit,
  onCancel,
  submitLabel,
  existingBooks,
  editingId = null,
}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const isEditing = editingId !== null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    const isbn = String(values.isbn).replace(/[-\s]/g, "");
    const qty = Number(values.quantity);

    if (!values.title.trim()) errs.title = "Title is required";
    if (!values.author.trim()) errs.author = "Author is required";
    if (!values.genre.trim()) errs.genre = "Genre is required";

    if (!/^(\d{9}[\dXx]|\d{13})$/.test(isbn)) {
      errs.isbn = "ISBN must be 10 or 13 digits";
    } else if (existingBooks.some((b) => b.isbn === isbn && b.id !== editingId)) {
      errs.isbn = "A book with this ISBN already exists";
    }

    if (values.quantity === "" || !Number.isInteger(qty) || qty < 0) {
      errs.quantity = "Quantity must be a whole number (0 or more)";
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onSubmit({
      title: values.title.trim(),
      author: values.author.trim(),
      genre: values.genre.trim(),
      isbn: String(values.isbn).replace(/[-\s]/g, ""),
      quantity: Number(values.quantity),
    });
    if (!isEditing) setValues(emptyBook);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="title">Title</label>
        <input id="title" name="title" value={values.title} onChange={handleChange} />
        {errors.title && <p className="error">{errors.title}</p>}
      </div>
      <div>
        <label htmlFor="author">Author</label>
        <input id="author" name="author" value={values.author} onChange={handleChange} />
        {errors.author && <p className="error">{errors.author}</p>}
      </div>
      <div>
        <label htmlFor="genre">Genre</label>
        <input id="genre" name="genre" value={values.genre} onChange={handleChange} />
        {errors.genre && <p className="error">{errors.genre}</p>}
      </div>
      <div>
        <label htmlFor="isbn">ISBN</label>
        <input id="isbn" name="isbn" value={values.isbn} onChange={handleChange} />
        {errors.isbn && <p className="error">{errors.isbn}</p>}
      </div>
      <div>
        <label htmlFor="quantity">
          {isEditing ? "Quantity (change on Transactions page)" : "Initial Quantity"}
        </label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          min="0"
          value={values.quantity}
          onChange={handleChange}
          disabled={isEditing}
        />
        {errors.quantity && <p className="error">{errors.quantity}</p>}
      </div>
      <button type="submit">{submitLabel}</button>
      {onCancel && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}