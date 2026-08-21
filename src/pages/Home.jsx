import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import '../styles/home.css';

const IMG_BY_KEYWORD = [
  { match: /sneaker|sports|running|nike|puma|adidas/i, url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80' },
  { match: /sandal|slipper|flip/i, url: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&q=80' },
  { match: /boot/i, url: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&q=80' },
  { match: /formal|leather|office|loafer/i, url: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&q=80' },
  { match: /kid|child/i, url: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600&q=80' },
  { match: /women|ladies|heel/i, url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80' },
];
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80';

function pickImage(item, categoryName) {
  if (item.imageUrl) return item.imageUrl;
  const text = `${item.name} ${categoryName || ''}`;
  const found = IMG_BY_KEYWORD.find((k) => k.match.test(text));
  return found ? found.url : FALLBACK_IMG;
}

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const [cart, setCart] = useState([]); // [{ itemId, name, price, quantity }]
  const [cartOpen, setCartOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [placing, setPlacing] = useState(false);
  const [orderMsg, setOrderMsg] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [catsRes, itemsRes] = await Promise.all([api.get('/category'), api.get('/item')]);
        setCategories(catsRes.data);
        setItems(itemsRes.data);
      } catch {
        setError('Could not load the shop. Please make sure the API is running.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const visibleItems = items
    .filter((i) => activeCategory === 'all' || String(i.categoryId) === String(activeCategory))
    .filter((i) => i.name.toLowerCase().includes(search.trim().toLowerCase()));

  const newArrivals = items.slice(-4).reverse();

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.itemId === item.id);
      if (existing) {
        return prev.map((c) => c.itemId === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { itemId: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const changeQty = (itemId, delta) => {
    setCart((prev) => prev
      .map((c) => c.itemId === itemId ? { ...c, quantity: c.quantity + delta } : c)
      .filter((c) => c.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const placeOrder = async () => {
    if (!email.trim()) {
      setOrderMsg({ type: 'error', text: 'Please enter your email.' });
      return;
    }
    if (cart.length === 0) {
      setOrderMsg({ type: 'error', text: 'Your cart is empty.' });
      return;
    }
    setPlacing(true);
    setOrderMsg(null);
    try {
      await api.post('/order', {
        customerEmail: email.trim(),
        items: cart.map((c) => ({ itemId: c.itemId, quantity: c.quantity })),
      });
      setOrderMsg({ type: 'success', text: 'Order placed! Thank you for shopping with us.' });
      setCart([]);
    } catch (err) {
      setOrderMsg({
        type: 'error',
        text: err.response?.data?.message || 'Could not place order. Please try again.',
      });
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="home">
      {/* ===== Top green nav bar ===== */}
      <header className="home-nav">
        <Link to="/" className="home-brand">
  <div className="home-brand-mark">👟</div>
  <div>
    <div className="home-brand-name">Rohit Sole &amp; Stitch</div>
    <div className="home-brand-tag">STEP INTO STYLE</div>
  </div>
</Link>
        <nav className="home-nav-links">
          <a href="#products">Product</a>
          <a href="#feedback">Feedback</a>
          <a href="#signup">Sign Up</a>
          <Link to="/login">Login</Link>
          <a href="#contact">Contact Us</a>
        </nav>
        <div className="home-nav-actions">
          <button className="btn btn-ghost home-cart-btn" onClick={() => setCartOpen(true)}>
            Cart {cartCount > 0 && <span className="home-cart-badge">{cartCount}</span>}
          </button>
        </div>
      </header>

      {/* ===== Hero banner ===== */}
      <section className="home-hero">
        <div className="home-hero-text">
          <p className="eyebrow">The Fall/Winter Boot Edit</p>
          <h1>Step out in<br />something better.</h1>
          <p className="home-hero-sub">
            Handpicked shoes for every wear — gents, ladies, and kids. Fresh stock, honest prices.
          </p>
          <div className="home-hero-brands">
            <span>COACH</span><span>AEROSOLES</span><span>RAMPAGE</span><span>AND MORE!</span>
          </div>
          <a href="#products" className="btn btn-primary">Shop the collection</a>
        </div>
        <div className="home-hero-art">
          <img src={FALLBACK_IMG} alt="Featured shoe" />
        </div>
      </section>

      <section className="home-body">
        {/* ===== Left column: login box + categories ===== */}
        <aside className="home-sidebar stitched">
          <div className="home-login-box">
            <p className="panel-title">Login Area</p>
            <div className="field">
              <label>Username</label>
              <input type="text" placeholder="Username" />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" placeholder="Password" />
            </div>
            <Link to="/login" className="btn btn-primary btn-sm home-login-submit">Login</Link>
            <div className="home-login-links">
              <Link to="/register">New User?</Link>
              <a href="#forgot">Forgot Password?</a>
            </div>
          </div>

          <p className="eyebrow home-cat-title">Category</p>
          <ul className="home-cat-list">
            <li>
              <button
                className={activeCategory === 'all' ? 'active' : ''}
                onClick={() => setActiveCategory('all')}
              >All</button>
            </li>
            {categories.map((c) => (
              <li key={c.id}>
                <button
                  className={String(activeCategory) === String(c.id) ? 'active' : ''}
                  onClick={() => setActiveCategory(c.id)}
                >{c.name}</button>
              </li>
            ))}
          </ul>
        </aside>

        {/* ===== Right column: products ===== */}
        <main id="products" className="home-products">
          <div className="home-search">
            <input
              type="text"
              placeholder="Search shoes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-primary btn-sm">Search</button>
          </div>

          {error && <div className="alert-banner error">{error}</div>}
          {loading ? (
            <div className="empty-state">Loading shoes…</div>
          ) : visibleItems.length === 0 ? (
            <div className="empty-state">No shoes here yet.</div>
          ) : (
            <div className="home-grid">
              {visibleItems.map((item) => (
                <div key={item.id} className="home-card stitched fade-in">
                  <div className="home-card-img">
                    <img
                      src={pickImage(item, categories.find((c) => c.id === item.categoryId)?.name)}
                      alt={item.name}
                      onError={(e) => { e.target.src = FALLBACK_IMG; }}
                    />
                  </div>
                  <div className="home-card-body">
                    <p className="home-card-name">Name: {item.name}</p>
                    <p className="home-card-price">
                      Price: ₹{item.price}{' '}
                      <button className="home-card-view" onClick={() => addToCart(item)}>View</button>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </section>

      {/* ===== New Arrival ===== */}
      {newArrivals.length > 0 && (
        <section className="home-new-arrivals">
          <p className="eyebrow">New Arrival</p>
          <div className="home-grid home-grid-scroll">
            {newArrivals.map((item) => (
              <div key={item.id} className="home-card stitched">
                <div className="home-card-img">
                  <img
                    src={pickImage(item, categories.find((c) => c.id === item.categoryId)?.name)}
                    alt={item.name}
                    onError={(e) => { e.target.src = FALLBACK_IMG; }}
                  />
                </div>
                <div className="home-card-body">
                  <p className="home-card-name">Name: {item.name}</p>
                  <p className="home-card-price">Price: ₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer id="contact" className="home-footer">
        <p>© {new Date().getFullYear()} Shoes Shopping — Admin console for the store.</p>
      </footer>

      {/* ===== Cart drawer ===== */}
      {cartOpen && (
        <div className="home-cart-overlay" onClick={() => setCartOpen(false)}>
          <div className="home-cart-panel stitched" onClick={(e) => e.stopPropagation()}>
            <div className="home-cart-header">
              <p className="panel-title">Your cart</p>
              <button className="btn btn-ghost btn-sm" onClick={() => setCartOpen(false)}>Close</button>
            </div>

            {orderMsg && <div className={`alert-banner ${orderMsg.type}`}>{orderMsg.text}</div>}

            {cart.length === 0 ? (
              <div className="empty-state">Your cart is empty.</div>
            ) : (
              <>
                <div className="home-cart-items">
                  {cart.map((c) => (
                    <div key={c.itemId} className="home-cart-line">
                      <div>
                        <p className="home-cart-line-name">{c.name}</p>
                        <p className="home-cart-line-price">₹{c.price} each</p>
                      </div>
                      <div className="home-cart-qty">
                        <button onClick={() => changeQty(c.itemId, -1)}>−</button>
                        <span>{c.quantity}</span>
                        <button onClick={() => changeQty(c.itemId, 1)}>+</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="home-cart-total">
                  <span>Total</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>

                <div className="field" style={{ marginTop: 16 }}>
                  <label>Your email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>

                <button className="btn btn-primary" style={{ width: '100%' }} onClick={placeOrder} disabled={placing}>
                  {placing ? 'Placing order…' : 'Place order'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
