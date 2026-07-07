# GearUp 🏋️

**"Rent Sports & Outdoor Gear Instantly"**

Backend API for a sports & outdoor equipment rental service. Customers browse and rent gear, providers manage inventory and fulfill orders, admins oversee the platform.

## 🛠 Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express 5
- **Database:** PostgreSQL (Prisma Postgres)
- **ORM:** Prisma 7
- **Auth:** JWT (access + refresh token) + bcrypt
- **Payment:** Stripe Checkout

## 🚀 Getting Started

```bash
# 1. install dependencies
npm install

# 2. setup environment
cp .env.example .env   # then fill the values

# 3. run migrations & generate client
npx prisma migrate dev

# 4. start dev server
npm run dev
```

### Environment Variables

| Variable                                        | Description                              |
| ----------------------------------------------- | ---------------------------------------- |
| `DATABASE_URL`                                   | PostgreSQL connection string             |
| `PORT`                                           | Server port (default 4000)               |
| `APP_URL`                                        | Frontend origin for CORS                 |
| `BCRYPT_SALT_ROUNDS`                             | bcrypt salt rounds                       |
| `JWT_ACCESS_SECRET` / `JWT_ACCESS_EXPIRES_IN`    | Access token secret & expiry             |
| `JWT_REFRESH_SECRET` / `JWT_REFRESH_EXPIRES_IN`  | Refresh token secret & expiry            |
| `STRIPE_SECRET_KEY`                              | Stripe secret key (`sk_test_...`)        |
| `STRIPE_WEBHOOK_SECRET`                          | Stripe webhook signing secret (`whsec_...`) |
| `STRIPE_SUCCESS_URL` / `STRIPE_CANCEL_URL`       | Redirect URLs after checkout             |

### Stripe Webhook (local)

```bash
npm run stripe:webhook
# forwards stripe events to localhost:4000/api/payments/webhook
```

## 👥 Roles

| Role         | Permissions                                                    |
| ------------ | -------------------------------------------------------------- |
| **CUSTOMER** | Browse gear, place rental orders, pay, track status, review     |
| **PROVIDER** | Manage gear inventory, view incoming orders, update order status |
| **ADMIN**    | Manage users, categories, oversee all gear & rentals            |

Users pick `CUSTOMER` or `PROVIDER` at registration. Admins are promoted directly in the database.

## 📡 API Endpoints

### Auth

| Method | Endpoint             | Access | Description                  |
| ------ | -------------------- | ------ | ---------------------------- |
| POST   | `/api/auth/register` | Public | Register (customer/provider) |
| POST   | `/api/auth/login`    | Public | Login, returns JWT           |
| GET    | `/api/auth/me`       | All    | Current user info            |

### Gear (Public)

| Method | Endpoint          | Access | Description                                                       |
| ------ | ----------------- | ------ | ----------------------------------------------------------------- |
| GET    | `/api/gear`       | Public | All gear — filters: `search, category, brand, minPrice, maxPrice, availability` |
| GET    | `/api/gear/:id`   | Public | Gear details with reviews                                          |
| GET    | `/api/categories` | Public | All categories                                                     |

### Categories (Admin)

| Method | Endpoint              | Access | Description     |
| ------ | --------------------- | ------ | --------------- |
| POST   | `/api/categories`     | Admin  | Create category |
| PATCH  | `/api/categories/:id` | Admin  | Update category |
| DELETE | `/api/categories/:id` | Admin  | Delete category |

### Rental Orders

| Method | Endpoint                  | Access          | Description                     |
| ------ | ------------------------- | --------------- | ------------------------------- |
| POST   | `/api/rentals`            | Customer        | Place rental order (dates + items) |
| GET    | `/api/rentals`            | Customer        | My rental orders                |
| GET    | `/api/rentals/:id`        | Customer, Admin | Rental order details            |
| PATCH  | `/api/rentals/:id/cancel` | Customer        | Cancel order (only PLACED)      |

### Payments (Stripe)

| Method | Endpoint                | Access          | Description                            |
| ------ | ----------------------- | --------------- | -------------------------------------- |
| POST   | `/api/payments/create`  | Customer        | Create Stripe checkout session         |
| POST   | `/api/payments/confirm` | Customer        | Verify payment, mark order PAID        |
| POST   | `/api/payments/webhook` | Stripe          | Stripe webhook (auto confirm)          |
| GET    | `/api/payments`         | Customer        | My payment history                     |
| GET    | `/api/payments/:id`     | Customer, Admin | Payment details                        |

### Provider

| Method | Endpoint                   | Access   | Description                                             |
| ------ | -------------------------- | -------- | ------------------------------------------------------- |
| POST   | `/api/provider/gear`       | Provider | Add gear                                                |
| PUT    | `/api/provider/gear/:id`   | Provider | Update own gear                                         |
| DELETE | `/api/provider/gear/:id`   | Provider | Remove gear (soft remove if it has rental history)      |
| GET    | `/api/provider/orders`     | Provider | Incoming orders                                         |
| PATCH  | `/api/provider/orders/:id` | Provider | Update status: `CONFIRMED` / `PICKED_UP` / `RETURNED`   |

### Reviews

| Method | Endpoint       | Access   | Description                        |
| ------ | -------------- | -------- | ---------------------------------- |
| POST   | `/api/reviews` | Customer | Review gear (only after RETURNED)  |

### Admin

| Method | Endpoint               | Access | Description                        |
| ------ | ---------------------- | ------ | ---------------------------------- |
| GET    | `/api/admin/users`     | Admin  | All users                          |
| PATCH  | `/api/admin/users/:id` | Admin  | Suspend/activate user              |
| GET    | `/api/admin/gear`      | Admin  | All gear listings                  |
| GET    | `/api/admin/rentals`   | Admin  | All rental orders                  |

## 📊 Rental Order Status Flow

```
PLACED ─(provider)→ CONFIRMED ─(payment)→ PAID ─(provider)→ PICKED_UP ─(provider)→ RETURNED
   └─(customer)→ CANCELLED
```

- Stock decreases when an order is placed, restores on cancel or return.
- Payment: create checkout session → pay on Stripe (test card `4242 4242 4242 4242`) → confirm (API or webhook) → order becomes `PAID`.
- Reviews recalculate the gear's average rating automatically.

## 📬 Postman

Import [`GearUp.postman_collection.json`](./GearUp.postman_collection.json) — login saves the token automatically, created IDs (category, gear, order, payment) are auto-captured into collection variables.
