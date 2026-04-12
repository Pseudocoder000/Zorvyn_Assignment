🏦 Gullak — AI-Powered Personal Finance Manager

A modern full-stack finance tracking application with AI-powered bank statement parsing, real-time dashboards, and intelligent insights.

🚀 Overview

Gullak is a smart personal finance management platform that helps users:

Track income & expenses
Analyze financial habits
Upload bank statements (CSV/PDF/TXT)
Automatically extract transactions using AI
Visualize financial data with dynamic dashboards
✨ Features
🔹 Core Features
🔐 Authentication (JWT-based)
💸 Manual Transaction Management
📊 Dynamic Dashboard
📈 Real-time Insights & Analytics
🧾 Transaction History & Filtering
🔹 AI-Powered Features (🔥 Highlight)
📂 Upload CSV / PDF / TXT bank statements
🤖 AI-based parsing (Gemini API)
🧠 Intelligent extraction of:
Date
Description
Amount
Transaction type (Income/Expense)
Category
🚫 Automatically ignores:
Bank logos
Headers/footers
Irrelevant text
🔹 Smart Calculations
💰 Balance Calculation
Balance = Initial Balance + Income - Expense
📊 Monthly Income & Expense
📉 Spending Breakdown (category-wise)
📈 Balance Trends
💡 Savings Rate
🔹 Dashboard Modules
Total Balance
Income (This Month)
Expenses (This Month)
Recent Transactions
Balance Trend Graph
Spending Breakdown (Pie Chart)
Budget Tracker
🔹 Transactions Page
Add / Delete / Update transactions
Upload bank statements (CSV/PDF/TXT)
Auto-sync with dashboard
🔹 Insights Page
Top Spending Category
Savings Rate
Monthly Comparison
Financial Overview
🧠 Upcoming Features (🚧)
💬 AI Financial Chatbot
Smart financial discussions
Expense analysis
Budget recommendations
Personalized insights

⚡ Coming soon: Conversational AI for finance guidance

🛠️ Tech Stack
Frontend
React.js
Redux Toolkit
Tailwind CSS
Recharts
Backend
Node.js
Express.js
MongoDB
Mongoose
AI Integration
Gemini API (@google/generative-ai)
File Processing
Multer (file uploads)
PDF/Text parsing
📂 Project Structure
Gullak/
│
├── Frontend/
│   ├── components/
│   ├── pages/
│   ├── features/
│   └── utils/
│
├── Backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   │   └── geminiParser.js
│   └── config/
⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/your-username/gullak.git
cd gullak
2️⃣ Backend Setup
cd Backend
npm install

Create .env file:

PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
GEMINI_API_KEY=your_gemini_api_key

Run backend:

npm run dev
3️⃣ Frontend Setup
cd Frontend
npm install
npm run dev
🔐 Environment Variables
Variable	Description
MONGODB_URI	MongoDB connection string
JWT_SECRET	Authentication secret
GEMINI_API_KEY	Gemini AI API key
🤖 How AI Parsing Works
Upload File
   ↓
Extract Raw Text
   ↓
Send to Gemini AI
   ↓
AI extracts structured JSON
   ↓
Store in MongoDB
   ↓
Update Dashboard
⚠️ Important Notes
Bank APIs are not directly integrated
System uses AI-based parsing simulation
Supports multiple file formats dynamically
No strict CSV format required
💡 Future Enhancements
📊 Advanced financial analytics
🔔 Smart alerts & reminders
📱 Mobile app version
🌐 Multi-bank integration (if approved)
🤖 AI chatbot assistant
🤝 Contributing

Contributions are welcome!
Feel free to fork the repo and submit a PR.

📄 License

This project is licensed under the MIT License.

👩‍💻 Author

Jaya Ganguly

Full Stack Developer
Passionate about building intelligent systems
🌟 Final Note

Gullak is not just a finance tracker — it’s evolving into an AI-powered financial assistant 🚀

If you want, I can
