````markdown
# Cost Manager RESTful Web Services

**No fluff, just budgets.** This Node.js API helps you track personal costs like a hawk (minus the eye-patch).

---

## 📝 Overview

Manage your hard-earned shekels (or dollars, or whatever floats your boat) with simple CRUD endpoints. Perfect for:

- Freelancers who lose receipts.
- Students who can’t remember if they spent NIS 20 or NIS 200.
- Anyone who’s tired of Excel nightmares.

---

## 🚀 Features

- **Add Cost Item** (`POST /api/add`): Log a new expense in under a second.
- **Get Monthly Report** (`GET /api/report?id=<user>&year=<year>&month=<month>`): Pull up all costs for a given month.
- **Get User Details** (`GET /api/users/:id`): See user profile and total spending.
- **Get Devs Info** (`GET /api/about`): Because we deserve some credit.

---

## 💎 Prerequisites

- **Node.js** v16+
- **MongoDB Atlas** account (or local MongoDB if you’re feeling brave)

---

## 🔧 Installation

1. **Clone**
   ```bash
   git clone <repository-url>
   cd cost-manager-restful-web-services
````

2. **Install deps**

   ```bash
   npm install
   ```

3. **Configure**

   * Duplicate `.env.example` as `.env`.
   * Fill in your MongoDB URI:

     ```env
     PORT=3000
     MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
     ```

4. **Run**

   ```bash
   npm start
   ```

   Server fires up on `http://localhost:3000` (unless your 3000 is taken).

---

## 📂 Project Structure

```
.
├── app.js             # Entry point
├── utils/
│   └── db.js          # MongoDB connection
├── models/
│   ├── cost_model.js  # Cost schema
│   └── user_model.js  # User schema
├── routes/
│   ├── cost_routes.js # /api/add, /api/report
│   └── user_routes.js # /api/users, /api/about
├── tests/
│   ├── cost.test.js
│   ├── user.test.js
│   └── about.test.js
├── .env.example       # Env example
└── README.md          # You are here
```

---

## 🔌 API Endpoints

### 1. Add Cost Item

```http
POST /api/add
Content-Type: application/json
```

```json
{
  "description": "Groceries",
  "category": "food",
  "userid": "123123",
  "sum": 100
}
```

* **201**: Returns the saved cost object.
* **4xx/5xx**: Error message.

### 2. Get Monthly Report

```http
GET /api/report?id=123123&year=2025&month=6
```

* **200**: Array of cost items for June 2025.
* **4xx/5xx**: Error message.

### 3. Get User Details

```http
GET /api/users/123123
```

* **200**: User info + `totalCost` field.
* **404**: User not found.

### 4. Get Developers Info

```http
GET /api/about
```

* **200**: Array of dev names, emails, roles.

---

## 🧪 Testing

We love tests. Uses **Jest** + **Supertest**.

```bash
npm test
```

---

## 🤝 Contributing

1. **Fork** the repo.
2. Create a branch: `git checkout -b feature/cool-feature`
3. **Code** it up.
4. **Test** it.
5. **PR**: Open a pull request and explain why it rocks.

---

## 📜 License

MIT. Do whatever, just don’t blame us if you overspend.

```
```
