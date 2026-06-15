# 🌐 Nova App — Next.js 13 Fullstack Auth Starter

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-13-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens)

A sleek, RTL-ready **fullstack** web application built with **Next.js 13 (Page Router)** featuring JWT authentication, MongoDB database, smart sidebar navigation, protected routes, and a full-featured admin panel.

[🚀 Live Demo](#) · [🐛 Report Bug](https://github.com/afraz-saeed1986/Next_JWT13/issues) · [✨ Request Feature](https://github.com/afraz-saeed1986/Next_JWT13/issues)

</div>

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure token-based auth with httpOnly cookies
- 🗄️ **MongoDB Database** — Persistent user storage via Mongoose models
- 🧭 **Smart Sidebar** — Dynamically shows Login/Register or Dashboard/Logout based on auth state
- 🛡️ **Protected Routes** — Server-side and client-side route guarding
- 📊 **Admin Panel** — Full user management with table, charts, logs and settings
- 🌙 **Dark Theme** — Modern dark UI with CSS variables and glow effects
- 🇮🇷 **RTL & Persian UI** — Full Farsi support with Vazirmatn font
- 📱 **Fully Responsive** — Mobile-friendly with collapsible sidebar drawer
- ⚡ **API Routes** — Built-in Next.js API endpoints for auth and data

---

## 🛠️ Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | Next.js 13, React 18, CSS Variables |
| Backend  | Next.js API Routes (Node.js)        |
| Database | MongoDB + Mongoose                  |
| Auth     | JSON Web Tokens (JWT)               |
| Styling  | Pure CSS, Vazirmatn Font (RTL)      |
| Language | JavaScript (no TypeScript)          |

---

## 📁 Project Structure

```
Next_JWT13/
├── pages/
│   ├── _app.js              # AuthProvider + global CSS
│   ├── _document.js         # Font & RTL setup
│   ├── index.js             # Home page
│   ├── login.js             # Login page
│   ├── register.js          # Register page
│   ├── dashboard.js         # Protected dashboard
│   ├── adminPanel.js        # Admin panel
│   └── api/
│       ├── auth/
│       │   ├── login.js     # POST /api/auth/login
│       │   ├── register.js  # POST /api/auth/register
│       │   └── logout.js    # POST /api/auth/logout
│       └── users/
│           └── index.js     # GET /api/users
├── components/
│   ├── Layout.js            # Shell with topbar
│   └── Sidebar.js           # Auth-aware sidebar
├── models/
│   └── User.js              # Mongoose User schema
├── configs/
│   └── db.js                # MongoDB connection
├── utils/
│   └── auth.js              # JWT helpers
├── styles/
│   └── globals.css          # Full design system
├── public/
├── .env                     # Environment variables
└── next.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16 or higher
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas)

### 1. Clone the repository

```bash
git clone https://github.com/afraz-saeed1986/Next_JWT13.git
cd Next_JWT13
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root and add:

```env
MONGODB_URI=mongodb://localhost:27017/nova-app
# or Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/nova-app

JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
```

> ⚠️ Never commit `.env.local` to version control.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Auth Flow

```
User visits /          →  Sidebar shows: Login | Register
User registers/logs in →  JWT issued, stored in httpOnly cookie
User redirected to /dashboard
User revisits /        →  Sidebar shows: Dashboard | Logout
User logs out          →  Cookie cleared, redirect to /
```

---

## 📡 API Endpoints

| Method | Endpoint             | Description           | Auth Required |
| ------ | -------------------- | --------------------- | ------------- |
| POST   | `/api/auth/register` | Register new user     | ❌            |
| POST   | `/api/auth/login`    | Login & receive JWT   | ❌            |
| POST   | `/api/auth/logout`   | Clear auth cookie     | ✅            |
| GET    | `/api/users`         | Get all users (admin) | ✅            |

---

## 🗄️ Database Schema

### User Model

```js
{
  name:      String,   // required
  email:     String,   // required, unique
  password:  String,   // hashed with bcrypt
  role:      String,   // 'admin' | 'editor' | 'viewer'
  status:    String,   // 'active' | 'inactive' | 'banned'
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📦 Build for Production

```bash
npm run build
npm start
```

---

## 🌍 Deploy on Vercel

The easiest way to deploy is via [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repo on [vercel.com/new](https://vercel.com/new)
3. Add environment variables in the Vercel dashboard
4. Deploy 🚀

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the project
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License.

---

<div align="center">
Made with ❤️ by <a href="https://github.com/afraz-saeed1986">afraz-saeed1986</a>
</div>
