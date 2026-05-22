# EMPLOYEE MANAGEMENT SYSTEM

A complete Employee Management System web application built using HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB.

This project allows administrators to securely manage employee records with full CRUD (Create, Read, Update, Delete) functionality and authentication.

## Features

* Secure Admin Login Authentication
* JWT Authentication
* Password Hashing using bcrypt
* Add Employee
* View Employees
* Update Employee Details
* Delete Employee Records
* Protected Routes
* Search Employees
* Responsive Dashboard UI
* MongoDB Database Integration

## Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MongoDB

## Project Structure

```bash id="e11"
project/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── scripts/
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── dashboard.html
│   └── index.html
│
├── README.md
├── package.json
└── server.js
```

## Installation

### Clone Repository

```bash id="e12"
git clone https://github.com/your-username/EMPLOYEE-MANAGEMENT-SYSTEM.git
```

### Install Dependencies

```bash id="e13"
npm install
```

### Run Server

```bash id="e14"
npm start
```

## Environment Variables

Create a `.env` file and add:

```env id="e15"
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

## Main Functionalities

* Admin Authentication System
* Employee CRUD Operations
* Protected Dashboard
* REST APIs
* Form Validation
* Responsive UI

## Future Improvements

* Dark Mode
* Pagination
* Toast Notifications
* Employee Profile Modal
* Advanced Search Filter

## Author

MD MOHIUL ISLAM

## License

MIT License
