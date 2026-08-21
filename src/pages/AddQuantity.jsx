import { useEffect, useState } from 'react';
import api from '../api/api';
import '../styles/page.css';

export default function AddQuantity() {
  const [items, setItems] = useState([]);
  const [itemId, setItemId] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/item');
      setItems(res.data);
    } catch {
      setMessage({ type: 'error', text: 'Could not load items. Is the API running?' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemId || !amount) return;
    try {
      await api.put('/item/add-quantity', { itemId: parseInt(itemId, 10), amount: parseInt(amount, 10) });
      setMessage({ type: 'success', text: 'Stock updated.' });
      setAmount('');
      load();
    } catch {
      setMessage({ type: 'error', text: 'Could not update stock for that item.' });
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Add Quantity</h2>
          <p>Top up stock for an existing item — enter how many pairs just came in.</p>
        </div>
      </div>

      {message && <div className={`alert-banner ${message.type}`}>{message.text}</div>}

      <div className="panel stitched">
        <p className="panel-title">Restock an item</p>
        <form className="inline-form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Item</label>
            <select value={itemId} onChange={(e) => setItemId(e.target.value)} required>
              <option value="">Select item</option>
              {items.map((i) => (
                <option key={i.id} value={i.id}>{i.name} — currently {i.quantity} in stock</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Quantity to add</label>
            <input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 20" required />
          </div>
          <button type="submit" className="btn btn-primary">Add stock</button>
        </form>
      </div>

      <div className="panel stitched table-wrap">
        <p className="panel-title">Current stock levels</p>
        {loading ? (
          <div className="empty-state">Loading…</div>
        ) : items.length === 0 ? (
          <div className="empty-state">No items yet — add one from the Add Item page.</div>
        ) : (
          <table>
            <thead><tr><th>Item</th><th>Category</th><th>In stock</th></tr></thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id}>
                  <td>{i.name}</td>
                  <td>{i.categoryName}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{i.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
