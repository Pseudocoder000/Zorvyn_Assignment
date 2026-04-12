/**
 * 🔥 GEMINI BANK STATEMENT PARSER TEST
 * Super simple: Read TXT → Send to Gemini → Get JSON
 */

import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import parseWithGemini from "./utils/geminiParser.js";

// Load .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  try {
    // Check for API key
    if (!process.env.GEMINI_API_KEY) {
      console.log("❌ GEMINI_API_KEY not set");
      console.log("Add to .env file:");
      console.log("  GEMINI_API_KEY=your_key_here");
      console.log("\nGet free key from: https://makersuite.google.com/app/apikey");
      return;
    }

    console.log("📁 Reading bank statement...\n");
    const statementPath = path.join(__dirname, "sample-bank-statement.txt");
    const statementText = fs.readFileSync(statementPath, "utf-8");

    console.log("🧠 Sending to Gemini AI...");
    console.log("(This may take 5-10 seconds)\n");

    // Parse with Gemini
    const transactions = await parseWithGemini(statementText);

    console.log("✅ SUCCESS! Gemini extracted transactions:\n");
    console.log(JSON.stringify(transactions, null, 2));

    // Analytics
    console.log("\n\n📊 SUMMARY:");
    console.log("===========");
    console.log(`Total: ${transactions.length} transactions`);

    const expenses = transactions.filter((t) => t.type === "expense");
    const income = transactions.filter((t) => t.type === "income");

    console.log(`Expenses: ${expenses.length}`);
    console.log(`Income: ${income.length}`);

    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);

    console.log(`\nTotal Expense: ₹${totalExpense.toFixed(2)}`);
    console.log(`Total Income: ₹${totalIncome.toFixed(2)}`);
    console.log(`Net: ₹${(totalIncome - totalExpense).toFixed(2)}`);

    // By category
    console.log("\nBY CATEGORY:");
    const categories = {};
    transactions.forEach((t) => {
      if (!categories[t.category]) {
        categories[t.category] = { count: 0, amount: 0 };
      }
      categories[t.category].count++;
      categories[t.category].amount += t.amount;
    });

    Object.entries(categories).forEach(([cat, data]) => {
      console.log(
        `  ${cat}: ${data.count} txn, ₹${data.amount.toFixed(2)}`
      );
    });

    console.log("\n🚀 READY TO USE IN BACKEND!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

main();
