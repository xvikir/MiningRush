# ⛏️ Mining Rush

A blockchain-inspired educational web game where players answer questions to mine blocks, earn points, and compete on a global leaderboard.

## 🌐 Live Demo

🎮 Frontend (Vercel):
https://mining-rush.vercel.app

⚙️ Backend API (Render):
https://miningrushdd.onrender.com

❤️ Health Check:
https://miningrushdd.onrender.com/api/health

---

## 📖 Overview

Mining Rush is an educational browser game that combines blockchain mining mechanics with quiz-based gameplay.

Players answer progressively difficult questions to mine blocks. Scores are stored in MongoDB Atlas and displayed on a live leaderboard.

---

## ✨ Features

- 🎯 Dynamic questions loaded from MongoDB
- 🧱 Blockchain-inspired mining gameplay
- 🏆 Global leaderboard
- ⏱️ Timer-based challenges
- 📊 Persistent score storage
- 🔒 Backend validation for scores
- 🛡️ Secure REST API
- 🌍 Fully deployed online

---

## 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript (ES6)

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas
- Mongoose

### Deployment

- Vercel (Frontend)
- Render (Backend)

---

## 📂 Project Structure

```
MiningRush/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## 🚀 Running Locally

### Clone the repository

```bash
git clone https://github.com/xvikir/MiningRush.git
```

### Navigate into the project

```bash
cd MiningRush
```

### Install backend dependencies

```bash
cd backend
npm install
```

### Configure environment variables

Create a `.env` file inside the `backend` folder.

```env
MONGODB_URI=your_mongodb_connection_string
ADMIN_PASSWORD=your_admin_password
CORS_ORIGIN=http://localhost:5500
```

### Start the backend

```bash
npm start
```

### Start the frontend

Open the project with **Live Server** in VS Code.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/health` | API health check |
| GET | `/api/questions/random` | Get a random question |
| GET | `/api/leaderboard` | Get leaderboard |
| POST | `/api/scores` | Submit score |
| POST | `/api/admin/reset` | Reset leaderboard (Admin) |

---

## 🌍 Deployment

Frontend:
Vercel

Backend:
Render

Database:
MongoDB Atlas

---

## 📸 Screenshots

(Add gameplay screenshots here.)

---

## 👨‍💻 Author

**Vikir**

B.Tech Cybersecurity  
Amrita Vishwa Vidyapeetham

GitHub:
https://github.com/xvikir

---

## 📄 License

This project is intended for educational purposes.
