import { useEffect, useMemo, useState } from 'react';
import api from '../api/api';
import '../styles/page.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/order');
      setOrders(res.data);
    } catch {
      setMessage({ type: 'error', text: 'Could not load orders. Is the API running?' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const stats = useMemo(() => {
    const pending = orders.filter((o) => o.status === 'Pending').length;
    const complete = orders.filter((o) => o.status === 'Complete').length;
    const revenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    return { pending, complete, revenue };
  }, [orders]);

  const toggleStatus = async (order) => {
    const nextStatus = order.status === 'Pending' ? 'Complete' : 'Pending';
    try {
      await api.put(`/order/${order.id}/status`, { status: nextStatus });
      load();
    } catch {
      setMessage({ type: 'error', text: 'Could not update order status.' });
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>View Order</h2>
          <p>Track incoming orders and mark them complete once fulfilled.</p>
        </div>
      </div>

      {message && <div className={`alert-banner ${message.type}`}>{message.text}</div>}

      <div className="stat-row">
        <div className="panel stitched stat-card">
          <div className="stat-num">{orders.length}</div>
          <div className="stat-label">Total orders</div>
        </div>
        <div className="panel stitched stat-card">
          <div className="stat-num">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="panel stitched stat-card">
          <div className="stat-num">₹{stats.revenue.toFixed(0)}</div>
          <div className="stat-label">Total value</div>
        </div>
      </div>

      <div className="panel stitched table-wrap">
        <p className="panel-title">All orders</p>
        {loading ? (
          <div className="empty-state">Loading…</div>
        ) : orders.length === 0 ? (
          <div className="empty-state">No orders placed yet.</div>
        ) : (
          <table>
            <thead>
              <tr><th>Order</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <>
                  <tr key={o.id}>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>#{o.id}</td>
                    <td>{o.customerEmail}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                      {new Date(o.orderDate).toLocaleDateString()}
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => setExpandedId(expandedId === o.id ? null : o.id)}>
                        {o.orderItems.length} item{o.orderItems.length !== 1 ? 's' : ''} {expandedId === o.id ? '▲' : '▼'}
                      </button>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>₹{o.totalPrice.toFixed(2)}</td>
                    <td><span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span></td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => toggleStatus(o)}>
                        Mark {o.status === 'Pending' ? 'complete' : 'pending'}
                      </button>
                    </td>
                  </tr>
                  {expandedId === o.id && (
                    <tr>
                      <td colSpan={7} style={{ background: 'rgba(27,31,36,0.02)' }}>
                        <table>
                          <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Line total</th></tr></thead>
                          <tbody>
                            {o.orderItems.map((line, idx) => (
                              <tr key={idx}>
                                <td>{line.itemName}</td>
                                <td style={{ fontFamily: 'var(--font-mono)' }}>{line.quantity}</td>
                                <td style={{ fontFamily: 'var(--font-mono)' }}>₹{line.price}</td>
                                <td style={{ fontFamily: 'var(--font-mono)' }}>₹{line.totalPrice}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
