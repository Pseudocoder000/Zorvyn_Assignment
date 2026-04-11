# Gullak Backend 🎯

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Copy `.env.example` to `.env` and update values:
```bash
cp .env.example .env
```

### 3. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB (if not already installed)
# Windows: Download from https://www.mongodb.com/try/download/community
# Make sure MongoDB is running
# Default connection: mongodb://localhost:27017/gullak
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create account and create a cluster
3. Copy connection string to `.env`
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gullak
```

### 4. Start Backend

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will run on `http://localhost:5000`

---

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)

### Transactions
- `GET /api/transactions` - Get all transactions (Protected)
- `POST /api/transactions` - Create transaction (Protected)
- `GET /api/transactions/:id` - Get single transaction (Protected)
- `PUT /api/transactions/:id` - Update transaction (Protected)
- `DELETE /api/transactions/:id` - Delete transaction (Protected)
- `GET /api/transactions/stats/summary` - Get transaction stats (Protected)

### Dashboard
- `GET /api/dashboard/summary` - Get dashboard summary (Protected)
- `GET /api/dashboard/spending-by-category` - Get spending by category (Protected)
- `GET /api/dashboard/monthly-trend` - Get monthly trends (Protected)
- `GET /api/dashboard/budget-status` - Get budget status (Protected)

---

## Project Structure

```
Backend/
├── config/
│   └── db.js                 # Database connection
├── controllers/
│   ├── authController.js     # Auth logic
│   ├── transactionController.js
│   └── dashboardController.js
├── models/
│   ├── User.js              # User schema
│   ├── Transaction.js       # Transaction schema
│   └── Budget.js            # Budget schema
├── routes/
│   ├── authRoutes.js
│   ├── transactionRoutes.js
│   └── dashboardRoutes.js
├── middleware/
│   └── auth.js              # JWT middleware
├── data/
│   └── constants.js         # Constants & categories
├── server.js               # Main server file
├── package.json
├── .env.example
└── .env                    # Your actual env vars (don't commit)
```

---

## Features

✅ User Authentication (Email/Password)
✅ CRUD Operations for Transactions
✅ Dashboard Analytics
✅ Budget Tracking
✅ JWT Token-based auth
✅ Password Hashing with bcrypt
✅ MongoDB Integration
✅ Error Handling
✅ CORS enabled

---

## Common Issues

**Q: "Cannot connect to MongoDB"**
- Make sure MongoDB is running
- Check MONGODB_URI in .env
- For local: `mongodb://localhost:27017/gullak`

**Q: "JWT_SECRET is not defined"**
- Add JWT_SECRET to .env file
- Recommendation: Use a strong random string

**Q: "Port 5000 already in use"**
- Change PORT in .env
- Or kill the process using port 5000

---

## Next Steps

1. Start backend server
2. Test endpoints using Postman or VS Code REST Client
3. Connect frontend to this backend
4. Update Redux with API calls
