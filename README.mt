# Cost Manager RESTful Web Services

## Project Description

#Overview
Node.js based RESTful API service for managing personal costs and expenses.
---

## Features

- **Add Cost Item**: Add a new cost to the database.
- **Get Monthly Report**: Retrieve all cost items for a specific user within a specific month and year.
- **Get User Details**: Retrieve user information along with the total cost for a specific user.
- **Get Developers Info**: Retrieve information about the developers who worked on the project.

---

## Prerequisites

- Node.js (v16 or later)
- MongoDB Atlas account

---

## Installation

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd cost-manager-restful-web-services
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:

   - Create a `.env` file in the root directory.
   - Add the following content:
     ```env
     PORT=3000
     MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
     ```
     Replace `<username>`, `<password>`, and `<dbname>` with your MongoDB credentials.

4. **Start the Server**:

   ```bash
   npm start
   ```

5. **Run Tests (Optional)**:
   ```bash
   npm test
   ```

---

## API Endpoints

### 1. **Add Cost Item**

- **Method**: `POST`
- **Endpoint**: `/api/add`
- **Request Body**:
  ```json
  {
    "description": "Groceries",
    "category": "food",
    "userid": "123123",
    "sum": 100
  }
  ```
- **Response**:
  - Success: Returns the added cost item.
  - Error: Returns an error message.

### 2. **Get Monthly Report**

- **Method**: `GET`
- **Endpoint**: `/api/report`
- **Query Parameters**:
  - `id`: User ID
  - `year`: Year (e.g., 2025)
  - `month`: Month (1-12)
- **Response**:
  - Success: Returns an array of cost items.
  - Error: Returns an error message.

### 3. **Get User Details**

- **Method**: `GET`
- **Endpoint**: `/api/users/:id`
- **Response**:
  - Success: Returns user details and total costs.
  - Error: Returns an error message.

### 4. **Get Developers Info**

- **Method**: `GET`
- **Endpoint**: `/api/about`
- **Response**:
  - Returns an array with developer details.

---

## Project Structure

```
.
├── app.js
├── routes
│   ├── cost_routes.js
│   └── user_routes.js
├── models
│   ├── cost_model.js
│   └── user_model.js
├── tests
│   ├── cost.test.js
│   └── user.test.js
│   └── about.test.js
├── utils
│   └── db.js
├── .env
├── package.json
└── README.md
```

---

## Dependencies

- **express**: Web framework for Node.js.
- **mongoose**: MongoDB object modeling tool.
- **dotenv**: Load environment variables from a `.env` file.
- **jest**: Testing framework (development dependency).
- **supertest**: HTTP assertions for testing (development dependency).

### Install all dependencies

To install all dependencies, run the following command:

```bash
npm install express mongoose dotenv jest supertest
```

---

## Contribution

Feel free to fork the repository and submit pull requests. For major changes, please open an issue to discuss what you would like to change.

---

