import { useEffect, useState } from 'react';
import api from '../api/api';
import '../styles/page.css';

const emptyForm = { name: '', description: '', price: '', quantity: '', size: '', imageUrl: '', categoryId: '' };

export default function Items() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [itemsRes, catsRes] = await Promise.all([api.get('/item'), api.get('/category')]);
      setItems(itemsRes.data);
      setCategories(catsRes.data);
    } catch {
      setMessage({ type: 'error', text: 'Could not load items. Is the API running?' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm(emptyForm); setEditingId(null); };

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price) || 0,
      quantity: parseInt(form.quantity, 10) || 0,
      size: form.size,
      imageUrl: form.imageUrl,
      categoryId: parseInt(form.categoryId, 10),
    };
    if (!payload.categoryId) {
      setMessage({ type: 'error', text: 'Please choose a category first.' });
      return;
    }
    try {
      if (editingId) {
        await api.put(`/item/${editingId}`, { ...payload, id: editingId });
        setMessage({ type: 'success', text: 'Item updated.' });
      } else {
        await api.post('/item', payload);
        setMessage({ type: 'success', text: 'Item added.' });
      }
      resetForm();
      load();
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong saving the item.' });
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      imageUrl: item.imageUrl,
      categoryId: item.categoryId,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    try {
      await api.delete(`/item/${id}`);
      load();
    } catch {
      setMessage({ type: 'error', text: 'Could not delete this item.' });
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Add Item</h2>
          <p>Create shoes, set their price and starting stock, and assign a category.</p>
        </div>
      </div>

      {message && <div className={`alert-banner ${message.type}`}>{message.text}</div>}

      <div className="panel stitched">
        <p className="panel-title">{editingId ? 'Edit item' : 'New item'}</p>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label>Item name</label>
              <input type="text" value={form.name} onChange={handleChange('name')} placeholder="e.g. Canvas Sendal" required />
            </div>
            <div className="field">
              <label>Category</label>
              <select value={form.categoryId} onChange={handleChange('categoryId')} required>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="field field-full">
              <label>Description</label>
              <input type="text" value={form.description} onChange={handleChange('description')} placeholder="Short description" />
            </div>
            <div className="field">
              <label>Price (₹)</label>
              <input type="number" min="0" step="0.01" value={form.price} onChange={handleChange('price')} required />
            </div>
            <div className="field">
              <label>Starting quantity</label>
              <input type="number" min="0" value={form.quantity} onChange={handleChange('quantity')} required />
            </div>
            <div className="field">
              <label>Size</label>
              <input type="text" value={form.size} onChange={handleChange('size')} placeholder="e.g. 8, 9, 10" />
            </div>
            <div className="field">
              <label>Image URL</label>
              <input type="text" value={form.imageUrl} onChange={handleChange('imageUrl')} placeholder="https://…" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">{editingId ? 'Save changes' : 'Add item'}</button>
          {editingId && <button type="button" className="btn btn-ghost" style={{ marginLeft: 10 }} onClick={resetForm}>Cancel</button>}
        </form>
      </div>

      <div className="panel stitched table-wrap">
        <p className="panel-title">All items</p>
        {loading ? (
          <div className="empty-state">Loading…</div>
        ) : items.length === 0 ? (
          <div className="empty-state">No items yet — add one above.</div>
        ) : (
          <table>
            <thead>
              <tr><th>Name</th><th>Category</th><th>Size</th><th>Price</th><th>Qty</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id}>
                  <td>{i.name}</td>
                  <td>{i.categoryName}</td>
                  <td>{i.size || '—'}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>₹{i.price}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{i.quantity}</td>
                  <td className="action-cell">
                    <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(i)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(i.id)}>Delete</button>
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
