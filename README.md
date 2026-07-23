# Saree & Jewelry Admin Dashboard

A plain React (Create React App) admin dashboard — no Vite, no Tailwind, no Bootstrap.
Every component has its own `.js` and `.css` file, and every CSS class is prefixed
with the component's name (e.g. component `AddInventory` → classes `add-inventory__...`).

This build is wired to a **real backend** running at `http://localhost:5002` using **axios**.

## Getting started

```bash
npm install
npm start
```

The app opens at http://localhost:3000 and starts on the **Sign In** page. Make sure your
API server is running at `http://localhost:5002` (or set `REACT_APP_API_BASE_URL` — see below).

## Pointing at a different API URL

Create a `.env` file in the project root:

```
REACT_APP_API_BASE_URL=http://localhost:5002
```

## Build for production

```bash
npm run build
```

## Project structure

```
src/
  api/
    axiosClient.js       -> shared axios instance (baseURL, auth token header)
    authApi.js            -> POST /new/login
    categoriesApi.js      -> GET /category/get-category, POST create/delete-category
    subcategoriesApi.js   -> GET /category/get-sub-category, POST create/update/delete-sub-category
    productsApi.js        -> GET /products/get-products, POST create/update/delete-product
    ordersApi.js          -> GET /orders/get-orders, POST create-orders, POST order-status/:id/status
  data/
    mockData.js           -> local fallback data for Looms & Users (no backend routes provided for these)
  context/
    DataContext.js        -> app-wide state + CRUD actions, calls the api/ layer directly
  components/
    Layout/     -> page shell (Sidebar + Topbar + content outlet, mobile drawer)
    Sidebar/     -> left navigation (slides in as a drawer on mobile)
    Topbar/      -> top search bar + hamburger menu + account info
  pages/
    Login/                    -> Sign In screen, calls /new/login
    Dashboard/                 -> Operations Overview (live product/category/order counts)
    Inventory/                 -> Products list (from /products/get-products)
    AddInventory/              -> Add & Edit Product form (create = multipart upload, edit = JSON)
    Categories/                -> Category Management: main categories + their sub-categories
    Categories/AddCategory     -> Create a main category (no update route exists on the backend)
    Categories/AddSubcategory  -> Add/Edit a sub-category under a chosen main category
    Orders/                    -> Order Management list (matches the provided screenshot)
    Orders/OrderDetail         -> Single order view + status update / cancel (matches the screenshot)
    Looms/                     -> Loom Management (local only - no backend route provided)
    Looms/AddLoom              -> Add/Edit Loom form (local only)
    Users/                     -> User Management (local only - no backend route provided)
    Users/AddUser               -> Add/Edit User form (local only)
  App.js       -> routes, wraps everything in <DataProvider>
  index.js     -> React entry point
  index.css    -> global reset + design tokens (CSS variables)
```

## How the data flows

`DataContext` fetches categories, sub-categories, products, and orders from your API as soon
as the app loads, and every add/edit/delete action calls the matching endpoint in `src/api/`
directly, then re-fetches that list so the UI always reflects what the server has.

**Category → Sub-category flow:** a main category must be created first (`AddCategory`).
Once it exists, use "+ Add Sub" on its card in the Categories page (or the "+ New Category"
flow) to create sub-categories scoped to that `categoryId`, matching the backend's `create-sub-category`
payload shape `{ subcategory, categoryId }`.

**Products:** creating a product sends a `multipart/form-data` request (matching the
`upload.single("image")` middleware on `create-product`); editing sends plain JSON to
`update-product/:id` since that route has no file upload middleware.

**Orders:** the order list and detail page read from `/orders/get-orders` (there's no
single-order-by-id route, so the detail page finds the order from the already-fetched list).
"Update Status" and "Cancel Order" both call `/orders/order-status/:id/status`.

**Looms & Users:** no backend routes were provided for these two resources, so they still run
on local, in-memory mock data (`src/data/mockData.js`) — everything else (categories,
sub-categories, products, orders) is fully live against your API.

## Mobile responsiveness

Below 900px the sidebar becomes a slide-in drawer (tap the ☰ icon in the top bar to open it,
tap outside or the ✕ to close). Below 600px, stat cards, forms, and header buttons stack into
a single column, and wide tables scroll horizontally within their card so nothing overflows
the screen.

## A few assumptions worth double-checking against your live API

Since only route paths and a couple of sample payloads were provided, a few shapes were
assumed and may need a small tweak once you test against the real server:
- Sub-category create/update payload: `{ subcategory: "name", categoryId: 2 }`
- Sub-category response objects: `{ id, subcategory, categoryId }`
- Order objects: `{ id, status, createdAt, total, customerName, customerEmail, items: [...] }`
  (the Orders pages read several possible field name variants defensively, e.g.
  `order.total || order.totalAmount`, `item.qty || item.quantity`, so small naming
  differences shouldn't break the UI, but double-check the console/network tab if a screen
  looks empty).
- Login response is expected to include a `token` (checked as `token`, `accessToken`, or
  `data.token`) which gets saved to `localStorage` and sent as `Authorization: Bearer <token>`
  on every subsequent request.
