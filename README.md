<div align="center">

# ⚡ CLiNt — Campus Tech Workshop Management Platform

### Industry-grade technology workshops for engineering students worldwide

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens)](https://jwt.io/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Groq](https://img.shields.io/badge/AI-Groq%20LLaMA-orange?style=flat-square)](https://groq.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

[Live Demo](#) · [Report Bug](issues) · [Request Feature](issues)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Demo Credentials](#-demo-credentials)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 About

**CLiNt** is a full-stack EdTech platform built for a technology workshop company that conducts hands-on training for engineering students across India. The platform covers **AI & Machine Learning**, **Full-Stack Web Development**, **Cybersecurity**, and **Modern Developer Tools**.

Built as a complete production-ready web application with real authentication, database integration, AI chatbot, PDF certificate generation, and email notifications.

---

## ✨ Features

### 👨‍🎓 For Students
- Register and login with JWT authentication
- Browse workshops by category (AI, Web Dev, Cybersecurity, Dev Tools)
- Enroll in workshops with a booking form
- View enrolled workshops and track progress
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
- Powered by **Groq + LLaMA 3** (free & fast)
- Answers questions about workshops, enrollment, certificates
- Can help with general tech questions too

### 🌐 Platform
- Dark futuristic UI with modern design
- Fully responsive across mobile and desktop
- Real-time toast notifications
- Progressive Web App (PWA) ready

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite 5 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose |
| **Authentication** | JWT, bcryptjs |
| **AI Chatbot** | Groq API, LLaMA 3.1 |
| **PDF Generation** | PDFKit |
| **Email** | Nodemailer (Gmail SMTP) |
| **Fonts** | Syne, JetBrains Mono, Outfit |

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

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Git](https://git-scm.com/)
- A free [MongoDB Atlas](https://mongodb.com/atlas) account
- A Gmail account for email notifications
- A free [Groq](https://console.groq.com) account for AI chatbot

### Installation

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
```

**3. Seed the database**
```bash
npm run seed
```

**4. Start the backend**
```bash
npm run dev
# API running at http://localhost:5000
```

**5. Set up the frontend (new terminal)**
```bash
cd ../frontend
npm install
npm run dev
# App running at http://localhost:5173
```

**6. Open your browser**
```
http://localhost:5173
```

---

## 🔐 Environment Variables

Create a `.env` file inside `backend/`:

```env
# Server
PORT=5000
NODE_ENV=production
CLIENT_URL=http://localhost:5173

# MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/clint_db?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Gmail SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.email@gmail.com
SMTP_PASS=your_gmail_app_password

# Admin seed credentials
ADMIN_EMAIL=admin@clint.dev
ADMIN_PASSWORD=Admin@CLiNt2025

# Groq AI (free at console.groq.com)
GROQ_API_KEY=your_groq_api_key
```

> **Gmail App Password:** Go to Google Account → Security → 2-Step Verification → App Passwords → Generate.
> **Groq API Key:** Go to [console.groq.com](https://console.groq.com) → API Keys → Create Key (free).

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
| `GET` | `/api/workshops/:id` | Get workshop details | No |
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

## 🗄 Database Models

| Model | Key Fields |
|-------|-----------|
| **User** | name, email, password (hashed), role, college, phone |
| **Workshop** | title, category, duration, price, seats, enrolledCount |
| **WorkshopRequest** | college, contactPerson, email, topic, status, location |
| **Participant** | user (ref), workshop (ref), enrolledAt, progress |
| **Certificate** | user (ref), workshop (ref), certId, grade, score |
| **Resource** | title, workshop (ref), fileUrl, fileType, fileSize |

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@clint.dev` | `Admin@CLiNt2025` |
| **Student** | Register via signup | Your chosen password |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

Built with ❤️ by **Siddharth** · ⭐ Star this repo if you found it helpful!

</div>
