import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import UserForm from "../components/UserForm";
import UserTable from "../components/UserTable";

export default function Users() {
  const { users, addUser, updateUser, deleteUser } = useAuth();
  const [editingUser, setEditingUser] = useState(null);
  const [notice, setNotice] = useState(null);

  const handleSubmit = (data) => {
    const result = editingUser ? updateUser(editingUser.id, data) : addUser(data);
    if (result.ok) {
      setNotice(null);
      setEditingUser(null);
    } else {
      setNotice(result.error);
    }
  };

  const handleDelete = (user) => {
    if (!window.confirm(`Delete user "${user.name}"?`)) return;
    const result = deleteUser(user.id);
    setNotice(result.ok ? null : result.error);
    if (result.ok && editingUser?.id === user.id) setEditingUser(null);
  };

  return (
    <section>
      <p className="eyebrow">Administration</p>
      <h1>{editingUser ? "Update User" : "Add New User"}</h1>

      {notice && <p className="message bad">{notice}</p>}

      <UserForm
        key={editingUser ? editingUser.id : "new"}
        initialValues={editingUser ? { ...editingUser, password: "" } : undefined}
        editingId={editingUser ? editingUser.id : null}
        existingUsers={users}
        submitLabel={editingUser ? "Save Changes" : "Add User"}
        onSubmit={handleSubmit}
        onCancel={editingUser ? () => setEditingUser(null) : undefined}
      />

      <h2>All Users</h2>
      <UserTable users={users} onEdit={setEditingUser} onDelete={handleDelete} />
    </section>
  );
}