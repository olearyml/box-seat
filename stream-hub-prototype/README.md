# 🎟️ Box Seat

**Box Seat** is your all-in-one streaming dashboard to manage favorites, get smart recommendations, and set release reminders — across all your streaming services.

---

## 🚀 Features

- ✅ Search shows & movies via TMDB
- ⭐ Favorite and tag content
- 📤 Share favorites with friends
- 🔔 Enable release reminders
- 🧠 Smart recommendations by genre
- 🗂️ Organize favorites with filters
- 🔐 Login/signup with JWT
- 💻 Fullstack app with React + Node.js + PostgreSQL

---

## 📦 Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js (Express)
- **Database**: PostgreSQL (Neon-compatible)
- **Auth**: JWT
- **Data API**: TMDB (The Movie Database)

---

## 📁 Project Structure

```
/client   → React frontend
/server   → Express backend API
/docker-compose.yml → Optional container orchestration
```

---

## 🧑‍💻 Local Setup

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/box-seat.git
cd box-seat
```

### 2. Install Dependencies

```bash
cd server
npm install
npx prisma generate
cd ../client
npm install
```

### 3. Setup Environment

Create a `.env` file inside `/server/`:

```
DATABASE_URL=your_neon_db_url
TMDB_API_KEY=your_tmdb_key
JWT_SECRET=your_secret
```

### 4. Run the App

```bash
# Start backend
cd server
npm run dev

# In a new terminal, start frontend
cd client
npm start
```

---

## 🐳 Docker Setup (Optional)

### 1. Build & Run

```bash
docker-compose up --build
```

Backend will be available at [http://localhost:5000](http://localhost:5000)

---

## 🌐 Deployment Instructions

### Frontend on Vercel
- Deploy `/client` folder
- Build command: `npm run build`
- Output dir: `build`

### Backend on Render
- Connect `/server`
- Use Dockerfile
- Add ENV vars: `DATABASE_URL`, `TMDB_API_KEY`, `JWT_SECRET`

---

## 📝 License

MIT — built with 💜 by your team.

