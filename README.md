# Expense Tracker App

A full-stack expense tracker application with:

- 🔐 **Flask API** – for authentication, budget, and transaction management
- ⚛️ **React (TypeScript)** – for building a responsive and intuitive frontend UI
- 🎨 **CSS** – for custom styling
- ✅ **JWT Authentication**, **MongoDB**, and **Clean Architecture**

---

## 🧩 Features

### 🔧 Backend (Flask)
- JWT-based authentication (`/register`, `/login`)
- Protected routes for budget and expenses
- MongoDB integration via PyMongo
- Follows clean architecture & SOLID principles

### 💻 Frontend (React + TypeScript)
- Login/Register UI with form validation
- Dashboard to track budget and expenses
- Add, edit, delete, and list expenses
- Toast notifications and route protection

---

## 📦 Tech Stack

| Layer     | Stack                            |
|-----------|----------------------------------|
| Backend   | Python, Flask, Flask-JWT-Extended, PyMongo |
| Frontend  | React, TypeScript, Context API, Vite, CSS     |
| Database  | MongoDB Atlas                    |
| Testing   | Pytest (backend), Vitest + RTL (frontend) |

---

## 🚀 Getting Started

### Backend Setup

```bash
cd server
pip install -r requirements.txt
python run.py
```
### Frontend setup
```bash
cd client
npm install
npm run dev
```
### Docker setup
🛠️ Prerequisites
Docker
Docker Compose

```bash
docker-compose up --build
```
App will be available at:

Frontend: http://localhost:4000

Backend: http://localhost:5000

Link to live site - https://expense-tracker-peach-zeta.vercel.app/
