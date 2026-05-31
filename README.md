<div align="center">

# ⚡ CLiNt — Campus Tech Workshop Management Platform

### Industry-grade technology workshops for engineering students worldwide

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens)](https://jwt.io/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Groq](https://img.shields.io/badge/AI-Groq%20LLaMA-orange?style=flat-square)](https://groq.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)]()

[🌐 Live Demo](https://c-li-nt-platform-95e1.vercel.app) · [🎥 Demo Video](https://youtu.be/5bdNvsC51fU) · [🐛 Report Bug](issues) · [✨ Request Feature](issues)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Demo Credentials](#-demo-credentials)
- [License](#-license)

---

## 🚀 About

**CLiNt** is a full-stack AI-powered EdTech platform built during a college hackathon by a 1st year B.Tech student. The platform covers **AI & Machine Learning**, **Full-Stack Web Development**, **Cybersecurity**, and **Modern Developer Tools**.

Built as a complete production-ready web application with real authentication, database integration, AI chatbot, course completion analyser, PDF certificate generation, and automated email notifications.

> 🏆 Ranked among top projects across all B.Tech, BCA & BBA years in the hackathon.

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| **Frontend** | https://c-li-nt-platform-95e1.vercel.app |
| **Backend API** | https://clint-backend.onrender.com/api/health |
| **Demo Video** | https://youtu.be/5bdNvsC51fU |
| **GitHub** | https://github.com/SiDdHaRtH-0509/CLiNt-Platform |

> ⚠️ Backend hosted on Render free tier — first request may take 30-60 seconds to wake up.

---

## ✨ Features

### 👨‍🎓 For Students
- Register and login with JWT authentication
- Browse workshops by category (AI, Web Dev, Cybersecurity, Dev Tools)
- Enroll in workshops with a booking form
- View enrolled workshops and track progress
- **Course Completion Analyser** — progress bars, scores, grades, time spent, overall ring chart
- Download PDF certificates after completion
- Access workshop resources (slides, code kits, PDFs)
- AI chatbot for instant help

### 🏫 For Colleges
- Submit workshop requests via a public form
- Choose topic, expected students, location, and date
- Receive email notification on approval

### 👨‍💼 For Admins
- View and manage all workshop requests
- Approve or reject college requests with email notification
- View all registered students
- Upload and manage workshop materials
- Generate certificates for students
- Full analytics dashboard

### 🤖 AI Chatbot
- Powered by **Groq + LLaMA 3.1** (blazing fast)
- Answers questions about workshops, enrollment, certificates
- Floating bubble UI with auto-greeting

### 📊 Course Completion Analyser
- Overall progress ring chart
- Progress bar per workshop
- Score & grade tracker
- Time spent learning breakdown

### 🌐 Platform
- Dark/Light mode toggle
- Fully responsive across mobile and desktop
- Real-time toast notifications
- Automated welcome emails via Brevo

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite 5 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas |
| **Authentication** | JWT, bcryptjs |
| **AI Chatbot** | Groq API, LLaMA 3.1 |
| **Email** | Brevo (Transactional Email API) |
| **PDF Generation** | PDFKit |
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Render |

---

## 📁 Project Structure

```
clint-platform/
│
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx             # All pages & components
│   │   └── main.jsx            # React entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                    # Node.js + Express backend
│   ├── models/
│   │   └── index.js            # Mongoose schemas
│   ├── routes/
│   │   ├── auth.js             # Auth routes + middleware
│   │   └── workshops.js        # Workshop, request, admin, chat routes
│   ├── utils/
│   │   └── index.js            # PDF generator + email templates
│   ├── scripts/
│   │   └── seed.js             # Database seeder
│   ├── server.js               # Express entry point
│   ├── .env.example            # Environment variables template
│   └── package.json
│
└── README.md
```

---

## 🏁 Getting Started

> 🌐 **Live Demo available — no setup needed!**
> Visit: https://c-li-nt-platform-95e1.vercel.app

### Local Development

**1. Clone the repository**
```bash
git clone https://github.com/SiDdHaRtH-0509/CLiNt-Platform.git
cd CLiNt-Platform
```

**2. Set up the backend**
```bash
cd backend
npm install
cp .env.example .env
# Fill in your environment variables
npm run seed   # creates admin account + sample workshops
npm run dev    # API at http://localhost:5000
```

**3. Set up the frontend (new terminal)**
```bash
cd frontend
npm install
npm run dev    # App at http://localhost:5173
```

---

## 🔐 Environment Variables

Create a `.env` file inside `backend/`:

```env
PORT=5000
NODE_ENV=production
CLIENT_URL=https://c-li-nt-platform-95e1.vercel.app

MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/clint_db

JWT_SECRET=your_super_secret_jwt_key

BREVO_API_KEY=your_brevo_api_key

GROQ_API_KEY=your_groq_api_key

ADMIN_EMAIL=admin@clint.dev
ADMIN_PASSWORD=Admin@CLiNt2025
```

> **Brevo:** Free transactional email at [brevo.com](https://brevo.com) — 300 emails/day free
> **Groq:** Free AI API at [console.groq.com](https://console.groq.com)

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register new student | No |
| `POST` | `/api/auth/login` | Login, returns JWT | No |
| `GET` | `/api/auth/me` | Get current user | Yes |

### Workshops
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/workshops` | List all workshops | No |
| `POST` | `/api/workshops/:id/enroll` | Enroll in workshop | Yes |
| `GET` | `/api/workshops/my/enrolled` | My enrolled workshops | Yes |

### Workshop Requests
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/requests` | Submit college request | No |
| `GET` | `/api/requests` | Get all requests | Admin |
| `PATCH` | `/api/requests/:id/status` | Approve or reject | Admin |

### Admin
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/admin/students` | Get all students | Admin |

### AI Chatbot
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/chat` | Send message to AI | No |

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@clint.dev` | `Admin@CLiNt2025` |
| **Student** | Register via signup | Your chosen password |

---

## 🎵 Vibe Coding Project

Built during a **Vibe Coding Hackathon** — where the goal is to build real, functional products using AI-assisted development tools.

> "Vibe coding is not about writing less code — it's about building more, faster, and better."

---

## 📄 License

This project is proprietary software. All rights reserved.

© 2026 CLiNt Technologies — Siddharth

Unauthorized copying, modification, distribution, or use of this software is strictly prohibited without prior written permission.

---

<div align="center">

Built with ❤️ by **Siddharth** · ⭐ Star this repo if you found it helpful!

🌐 [Live Demo](https://c-li-nt-platform-95e1.vercel.app) · 🎥 [Watch Demo](https://youtu.be/5bdNvsC51fU) · 📦 [GitHub](https://github.com/SiDdHaRtH-0509/CLiNt-Platform)

</div>