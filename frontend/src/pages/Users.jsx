import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import UserForm from "../components/UserForm";
import UserTable from "../components/UserTable";

export default function Users() {
  const { users, addUser, updateUser, deleteUser } = useAuth();
  const [editingUser, setEditingUser] = useState(null);
  const [notice, setNotice] = useState(null);

  const handleSubmit = async (data) => {
    const result = editingUser
      ? await updateUser(editingUser.id, data)
      : await addUser(data);

    if (result.ok) {
      setNotice({
        ok: true,
        text: editingUser ? "User updated" : "User added",
      });
      setEditingUser(null);
    } else {
      setNotice({ ok: false, text: result.error });
    }
    return result;
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete user "${user.name}"?`)) return;
    const result = await deleteUser(user.id);
    if (result.ok) {
      setNotice({ ok: true, text: `"${user.name}" deleted` });
      if (editingUser?.id === user.id) setEditingUser(null);
    } else {
      setNotice({ ok: false, text: result.error });
    }
  };

  return (
    <section>
      <p className="eyebrow">Administration</p>
      <h1>{editingUser ? "Update User" : "Add New User"}</h1>

      {notice && <p className={notice.ok ? "message ok" : "message bad"}>{notice.text}</p>}

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