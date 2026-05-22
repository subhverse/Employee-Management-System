# Full Stack Employee Management System

A secure, beginner-friendly web application for administrators to manage employee records with authentication and full CRUD operations.

## Tech Stack

| Layer    | Technologies                          |
|----------|---------------------------------------|
| Frontend | HTML, CSS, Vanilla JavaScript         |
| Backend  | Node.js, Express.js                   |
| Database | MongoDB                               |
| Auth     | JWT, bcrypt password hashing          |

## Features

- **Admin authentication** – Email/password login with JWT tokens
- **Protected routes** – Dashboard and APIs require valid login
- **Employee CRUD** – Add, view, edit, and delete employees
- **Search & filter** – By name, department, or employee ID
- **Modern dashboard** – Sidebar, stats card, responsive table
- **Dark mode** – Toggle light/dark theme
- **Profile modal** – View full employee details
- **Toast notifications** – Success and error feedback

## Project Structure

```
Employee management system/
├── frontend/
│   ├── index.html          # Login page
│   ├── dashboard.html      # Admin dashboard
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── api.js          # API helper & auth storage
│       ├── auth.js         # Login logic
│       ├── dashboard.js    # CRUD & UI logic
│       └── theme.js        # Dark mode
├── backend/
│   ├── server.js           # Main server entry
│   ├── package.json
│   ├── .env.example
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── models/
│   │   ├── Admin.js
│   │   └── Employee.js
│   ├── middleware/
│   │   └── auth.js         # JWT protection
│   ├── controllers/
│   │   ├── authController.js
│   │   └── employeeController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── employeeRoutes.js
│   └── scripts/
│       └── createAdmin.js  # Create first admin user
└── README.md
```

## Prerequisites

Before you start, install:

1. [Node.js](https://nodejs.org/) (v18 or newer recommended)
2. [MongoDB](https://www.mongodb.com/try/download/community) (local) **or** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud)

## Step-by-Step Setup

### 1. Clone or open the project

```bash
cd "Employee management system"
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure environment variables

Copy the example file and edit it:

```bash
copy .env.example .env
```

On Mac/Linux:

```bash
cp .env.example .env
```

Edit `backend/.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/employee_management
JWT_SECRET=your_super_secret_jwt_key_change_this
PORT=5000
ADMIN_EMAIL=admin@company.com
ADMIN_PASSWORD=admin123
```

For **MongoDB Atlas**, replace `MONGODB_URI` with your Atlas connection string.

### 4. Start MongoDB

- **Local:** Start the MongoDB service on your machine.
- **Atlas:** No local install needed; use your cloud URI in `.env`.

### 5. Create the admin user

```bash
npm run create-admin
```

Default login (if you did not change `.env`):

- **Email:** `admin@company.com`
- **Password:** `admin123`

### 6. Start the server

```bash
npm start
```

The app runs at: **http://localhost:5000**

The backend serves the frontend, so you only need **one command** to run everything.

## How to Run

| Task              | Command              | Location   |
|-------------------|----------------------|------------|
| Install packages  | `npm install`        | `backend/` |
| Create admin      | `npm run create-admin` | `backend/` |
| Start application | `npm start`          | `backend/` |

Open your browser: **http://localhost:5000**

### Optional: Run frontend separately

If you prefer a separate static server for the frontend (e.g. Live Server on port 5500), update `API_BASE` in `frontend/js/api.js`:

```javascript
const API_BASE = 'http://localhost:5000/api';
```

Then run the backend on port 5000 as usual.

## API Endpoints

### Authentication (public)

| Method | Endpoint           | Description   |
|--------|--------------------|---------------|
| POST   | `/api/auth/login`  | Admin login   |

### Employees (protected – requires `Authorization: Bearer <token>`)

| Method | Endpoint              | Description        |
|--------|-----------------------|--------------------|
| GET    | `/api/employees`      | Get all (search)   |
| POST   | `/api/employees`      | Add employee       |
| GET    | `/api/employees/:id`  | Get one employee   |
| PUT    | `/api/employees/:id`  | Update employee    |
| DELETE | `/api/employees/:id`  | Delete employee    |

### Query parameters for search

- `?search=John` – Search by name
- `?department=Engineering` – Filter by department
- `?employeeId=EMP001` – Search by employee ID

## Employee Fields

| Field         | Type   | Required |
|---------------|--------|----------|
| Employee ID   | String | Yes      |
| Full Name     | String | Yes      |
| Email         | String | Yes      |
| Phone         | String | Yes      |
| Department    | String | Yes      |
| Job Position  | String | Yes      |
| Salary        | Number | Yes      |
| Joining Date  | Date   | Yes      |

## Security Notes

- Passwords are hashed with **bcrypt** before storage
- API routes for employees use **JWT middleware**
- Invalid or missing tokens return **401 Unauthorized**
- Change default admin password in production
- Use a strong, unique `JWT_SECRET` in production

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Cannot connect to MongoDB | Check MongoDB is running; verify `MONGODB_URI` in `.env` |
| Login fails | Run `npm run create-admin` again |
| 401 on dashboard | Log out and log in again; token may have expired |
| Port in use | Change `PORT` in `.env` to another port (e.g. 5001) |

## License

This project is open source for learning and educational use.
