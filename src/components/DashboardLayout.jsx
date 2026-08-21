import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DashboardLayout.css';

const NAV_ITEMS = [
  { to: '/dashboard/categories', label: 'Add Category', icon: '01' },
  { to: '/dashboard/items', label: 'Add Item', icon: '02' },
  { to: '/dashboard/quantity', label: 'Add Quantity', icon: '03' },
  { to: '/dashboard/orders', label: 'View Order', icon: '04' },
];

const PAGE_TITLES = {
  '/dashboard/categories': 'Add Category',
  '/dashboard/items': 'Add Item',
  '/dashboard/quantity': 'Add Quantity',
  '/dashboard/orders': 'View Order',
};

export default function DashboardLayout() {
  const { email, logout } = useAuth();

  const currentPath = window.location.pathname;
  const title = PAGE_TITLES[currentPath] || 'Dashboard';

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-mark">R</div>
          <div>
            <div className="sidebar-brand-name"> ROHIT Sole &amp; Stitch</div>
            <div className="sidebar-brand-tag">ADMIN CONSOLE</div>
          </div>
        </div>

        <div className="sidebar-eyebrow">Catalog &amp; Orders</div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">{email}</div>
          <button className="sidebar-logout" onClick={logout}>Log out</button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-title">{title}</div>
          <div className="topbar-time">localhost:5000/api</div>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
