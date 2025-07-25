# 🎟️ Show Booking App

An end-to-end full-stack application to book movie or event tickets online. Built using the MERN stack (MongoDB, Express.js, React.js, Node.js), this project simulates real-world booking workflows with authentication, seat selection, and user dashboards.

## 🔗 Live Demo
https://show-booking-react.onrender.com/login


---

## 🚀 Tech Stack

- **Frontend**: React.js, Tailwind CSS / Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Hosting**: Netlify (Frontend), Render / Railway / Cyclic (Backend)

---

## 🧩 Features

- 🔐 User Registration & Login (JWT Auth)
- 🎭 View list of shows or movies
- 🪑 Book seats for a selected show
- 📆 Filter shows by date or type
- 🧾 View your bookings
- 🧑 Admin panel (optional) to add shows or manage bookings
- 📱 Fully Responsive UI

---



## 🛠️ Setup & Installation

```bash
# 1. Clone the repository
git clone https://github.com/pandeynehagit/show-booking.git
cd show-booking

# 2. Install backend dependencies
cd server
npm install

# 3. Install frontend dependencies
cd ../client
npm install

# 4. Set up environment variables
# Create `.env` files in both `client/` and `server/` folders

# 5. Run the app
# Backend
cd server
npm run dev

# Frontend
cd ../client
npm start
