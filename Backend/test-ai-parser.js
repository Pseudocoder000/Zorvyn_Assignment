/**
 * Test script for AI Statement Parser
 * Processes the sample bank statement and outputs JSON transactions
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parseStatement } from "./utils/aiStatementParser.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  try {
    // Read the sample bank statement
    const statementPath = path.join(__dirname, "sample-bank-statement.txt");
    const statementText = fs.readFileSync(statementPath, "utf-8");

    console.log("Processing bank statement...\n");

    // Parse transactions
    const transactions = await parseStatement(statementText);

    // Output as JSON
    console.log("EXTRACTED TRANSACTIONS:");
    console.log("=======================\n");
    console.log(JSON.stringify(transactions, null, 2));

    // Summary statistics
    console.log("\n\nSUMMARY:");
    console.log("========");
    console.log(`Total Transactions: ${transactions.length}`);

    const expenses = transactions.filter((t) => t.type === "expense");
    const income = transactions.filter((t) => t.type === "income");

    console.log(`Expenses: ${expenses.length}`);
    console.log(`Income: ${income.length}`);

    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);

    console.log(`\nTotal Expense Amount: ₹${totalExpense.toFixed(2)}`);
    console.log(`Total Income Amount: ₹${totalIncome.toFixed(2)}`);
    console.log(`Net: ₹${(totalIncome - totalExpense).toFixed(2)}`);

    // Category breakdown
    console.log("\nBY CATEGORY:");
    const categories = {};
    transactions.forEach((t) => {
      if (!categories[t.category]) {
        categories[t.category] = { count: 0, amount: 0, type: t.type };
      }
      categories[t.category].count++;
      categories[t.category].amount += t.amount;
    });

    Object.entries(categories).forEach(([category, data]) => {
      console.log(
        `  ${category}: ${data.count} transactions, ₹${data.amount.toFixed(2)} (${data.type})`
      );
    });
  } catch (error) {
    console.error("Error processing statement:", error);
    process.exit(1);
  }
}

main();
