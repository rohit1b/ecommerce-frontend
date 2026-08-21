import { useEffect, useState } from 'react';
import api from '../api/api';
import '../styles/page.css';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/category');
      setCategories(res.data);
    } catch {
      setMessage({ type: 'error', text: 'Could not load categories. Is the API running?' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => { setName(''); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      if (editingId) {
        await api.put(`/category/${editingId}`, { name });
        setMessage({ type: 'success', text: 'Category updated.' });
      } else {
        await api.post('/category', { name });
        setMessage({ type: 'success', text: 'Category added.' });
      }
      resetForm();
      load();
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong saving the category.' });
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setName(cat.name);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await api.delete(`/category/${id}`);
      load();
    } catch {
      setMessage({ type: 'error', text: 'Could not delete — it may still have items linked to it.' });
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Add Category</h2>
          <p>Create and manage the categories items are grouped under.</p>
        </div>
      </div>

      {message && <div className={`alert-banner ${message.type}`}>{message.text}</div>}

      <div className="panel stitched">
        <p className="panel-title">{editingId ? 'Edit category' : 'New category'}</p>
        <form className="inline-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="cat-name">Category name</label>
            <input
              id="cat-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. GentsWear"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">{editingId ? 'Save changes' : 'Add category'}</button>
          {editingId && <button type="button" className="btn btn-ghost" onClick={resetForm}>Cancel</button>}
        </form>
      </div>

      <div className="panel stitched table-wrap">
        <p className="panel-title">All categories</p>
        {loading ? (
          <div className="empty-state">Loading…</div>
        ) : categories.length === 0 ? (
          <div className="empty-state">No categories yet — add one above.</div>
        ) : (
          <table>
            <thead>
              <tr><th>ID</th><th>Name</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted-text)' }}>#{c.id}</td>
                  <td>{c.name}</td>
                  <td className="action-cell">
                    <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(c)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
