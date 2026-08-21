# Rohit Sole & Stitch — Frontend

React (Vite) frontend for the Rohit Sole & Stitch shoe store — a customer-facing shop (browse shoes, cart, place orders) plus an admin dashboard (manage categories, items, stock, and view orders).

## Tech Stack

- React + Vite
- React Router
- Axios

## Project Structure

```
ecommerce-admin/
├── src/
│   ├── api/            # Axios instance (api.js) — talks to the backend
│   ├── components/      # DashboardLayout, ProtectedRoute
│   ├── context/         # AuthContext (login state)
│   ├── pages/            # Home, Login, Categories, Items, AddQuantity, Orders
│   └── styles/           # CSS files
```

## Setup

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- The [backend API](https://github.com/rohit1b/ecommerce-backend) running locally

### 2. Install dependencies

```powershell
cd ecommerce-admin
npm install
```

### 3. Configure the API base URL

Open `src/api/api.js` and confirm the backend URL matches where your backend is running:

```js
export const API_BASE_URL = 'http://localhost:5000/api';
```

Update the port if your backend runs on a different one.

### 4. Run the dev server

```powershell
npm run dev
```

The app will start at `http://localhost:5173`.

## Pages

- **`/`** — Shop home page (browse by category, add to cart, place an order)
- **`/login`** — Admin login
- **`/dashboard/categories`** — Add/manage categories
- **`/dashboard/items`** — Add/manage items
- **`/dashboard/quantity`** — Add stock quantity
- **`/dashboard/orders`** — View placed orders

## Notes

- `node_modules/`, `dist/`, and `.env` are git-ignored — see `.gitignore`.
- Make sure the backend's CORS settings (`Cors:AllowedOrigins` in its `appsettings.json`) include this app's dev server URL.
