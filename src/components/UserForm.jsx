import { useState } from "react";

const emptyUser = { name: "", membershipId: "", role: "member", password: "" };

export default function UserForm({
  initialValues = emptyUser,
  onSubmit,
  onCancel,
  submitLabel,
  existingUsers,
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
    const mid = values.membershipId.trim();

    if (!values.name.trim()) errs.name = "Name is required";

    if (!mid) {
      errs.membershipId = "Membership ID is required";
    } else if (
      existingUsers.some(
        (u) => u.membershipId.toLowerCase() === mid.toLowerCase() && u.id !== editingId
      )
    ) {
      errs.membershipId = "This membership ID is already taken";
    }

    if (!isEditing && values.password.length < 4) {
      errs.password = "Password must be at least 4 characters";
    } else if (isEditing && values.password && values.password.length < 4) {
      errs.password = "Password must be at least 4 characters";
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onSubmit({
      name: values.name.trim(),
      membershipId: values.membershipId.trim(),
      role: values.role,
      password: values.password,
    });
    if (!isEditing) setValues(emptyUser);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" value={values.name} onChange={handleChange} />
        {errors.name && <p className="error">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="membershipId">Membership ID</label>
        <input id="membershipId" name="membershipId" value={values.membershipId} onChange={handleChange} />
        {errors.membershipId && <p className="error">{errors.membershipId}</p>}
      </div>
      <div>
        <label htmlFor="role">Role</label>
        <select id="role" name="role" value={values.role} onChange={handleChange}>
          <option value="member">Member</option>
          <option value="librarian">Librarian</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div>
        <label htmlFor="password">
          {isEditing ? "New password (leave blank to keep)" : "Password"}
        </label>
        <input id="password" name="password" type="password" value={values.password} onChange={handleChange} />
        {errors.password && <p className="error">{errors.password}</p>}
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