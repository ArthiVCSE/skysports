# SkySports

SkySports is a full-stack sports e-commerce app built with Next.js, React, MUI, Tailwind CSS, MongoDB, and JWT cookie authentication.

## Features

- Product catalog with search, sorting, category chips, product details, and admin product management.
- Home page category cards with live product counts. Category links open filtered product results, such as `/products?category=Football`.
- Authenticated shopping flow. Guests can browse products, but cart, checkout, and orders require login.
- Persistent user cart stored in MongoDB after login.
- Checkout with Cash on Delivery, real cart line items, shipping calculation, and order creation.
- User order list and order tracking pages.
- Admin area with role-based access for `admin` users.
- Dynamic admin dashboard with product count, order count, delivered revenue, pending orders, active orders, items sold, recent orders, and catalog-by-category data.
- Admin order management with status updates.
- Contact messages and static info pages for FAQ, terms, and privacy.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- MongoDB with Mongoose
- MUI and Tailwind CSS
- JWT authentication with HTTP-only cookies

## Getting Started

Install dependencies:

```bash
npm install
```

Create `.env` in the project root:

```env
MONGODB_URI=your_mongodb_connection_string
url=your_mongodb_connection_string
JWT_SECRET=replace_with_a_strong_secret
```

The app currently supports both `MONGODB_URI` and `url` because different database helpers read different names.

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Seed Products

After the database connection is configured, seed the demo products by visiting:

```text
http://localhost:3000/api/seed
```

The seed data lives in `lib/data.ts`.

## Authentication

Register or log in from the storefront pages. To use the admin dashboard, log in with:

```text
admin@skysports.com
```

The first login for that email is auto-created as an admin user for demo convenience. Use the same password for later logins.

## Main Routes

- `/` and `/home` - storefront home
- `/products` - catalog
- `/products?category=Football` - category-filtered catalog
- `/products/[id]` - product detail
- `/cart` - authenticated cart
- `/checkout` - authenticated checkout
- `/orders` - authenticated user orders
- `/orders/[id]` - order tracking
- `/profile` - user profile
- `/admin` - admin dashboard
- `/admin/products` - admin product management
- `/admin/orders` - admin order management
- `/admin/messages` - admin contact messages

## API Highlights

- `GET /api/products` - list products, supports `category`
- `POST /api/products` - admin-only product creation
- `GET /api/cart` - authenticated user cart
- `POST /api/cart` - authenticated cart sync
- `POST /api/orders` - authenticated order creation
- `GET /api/orders/user/[id]` - authenticated user orders, admin can view any user
- `GET /api/admin/stats` - admin dashboard metrics
- `GET /api/admin/orders` - admin order list
- `PUT /api/admin/orders/[id]` - admin order status update

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Verification Notes

`npm run build` should complete successfully.

`npm run lint` currently reports existing lint issues in a few older pages and API files, mostly `no-explicit-any`, unescaped apostrophes, and `<img>` warnings. These do not block the production build, but they should be cleaned up before tightening CI.
