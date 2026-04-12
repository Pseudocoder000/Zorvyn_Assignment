/**
 * AI-Powered Bank Statement Parser
 * Extracts structured transaction data from raw bank statement text
 * Handles inconsistent formats using intelligent parsing and categorization
 */

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

/**
 * Category mapping for auto-categorization
 */
const CATEGORY_KEYWORDS = {
  Salary: [
    "salary",
    "wages",
    "gopa",
    "ganguly",
    "payroll",
    "jimps",
    "transfer",
  ],
  Groceries: [
    "grocery",
    "groceries",
    "supermarket",
    "food",
    "bakery",
    "market",
    "mart",
    "grocery mart",
    "tomato limited",
  ],
  Transport: [
    "taxi",
    "uber",
    "cab",
    "train",
    "bus",
    "fuel",
    "gas",
    "petrol",
    "railway",
    "transport",
    "metro",
    "auto",
  ],
  Entertainment: [
    "cinema",
    "movie",
    "theater",
    "netflix",
    "spotify",
    "gaming",
    "game",
    "entertainment",
  ],
  Utilities: [
    "electricity",
    "water",
    "gas",
    "internet",
    "phone",
    "mobile",
    "utility",
    "telecom",
  ],
  Healthcare: [
    "doctor",
    "hospital",
    "pharmacy",
    "medical",
    "health",
    "clinic",
    "dentist",
  ],
  Shopping: [
    "amazon",
    "flipkart",
    "ebay",
    "mall",
    "store",
    "shop",
    "retail",
    "clothing",
    "suryadeep stores",
    "stores",
  ],
  Dining: [
    "restaurant",
    "cafe",
    "pizza",
    "burger",
    "food service",
    "hotel",
  ],
  Finance: [
    "loan",
    "credit",
    "interest",
    "bank",
    "investment",
    "insurance",
    "bajaj",
    "hdf",
  ],
};

/**
 * Detect category from description
 */
function detectCategory(description) {
  const lowerDesc = description.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((keyword) => lowerDesc.includes(keyword))) {
      return category;
    }
  }

  return "Other";
}

/**
 * Parse date in various formats
 */
function parseDate(dateStr) {
  if (!dateStr) return null;

  // DD/MM/YYYY or DD-MM-YYYY
  const ddmmyyyyMatch = dateStr.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (ddmmyyyyMatch) {
    const [, day, month, year] = ddmmyyyyMatch;
    const date = new Date(`${year}-${month}-${day}`);
    if (!isNaN(date)) {
      return date.toISOString().split("T")[0];
    }
  }

  // YYYY-MM-DD
  const yyyymmddMatch = dateStr.match(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
  if (yyyymmddMatch) {
    const [, year, month, day] = yyyymmddMatch;
    const date = new Date(`${year}-${month}-${day}`);
    if (!isNaN(date)) {
      return date.toISOString().split("T")[0];
    }
  }

  return null;
}

/**
 * Clean description by removing special characters and extra spacing
 */
function cleanDescription(description) {
  if (!description) return "";

  // Remove transaction codes (patterns like FDL/000152, UT/000000553, etc.)
  let cleaned = description
    .replace(/[A-Za-z]{2,4}\/\d{3,10}\/*/g, "") // Remove codes like FDL/000152/
    .replace(/UPI\/\d+\//g, "") // Remove UPI codes
    .replace(/SRI\/\d+\//g, "") // Remove SRI codes
    .replace(/UT\/\d+\//g, "") // Remove UT codes
    .replace(/YESBYLRUH\//g, "") // Remove YESBY bank codes
    .replace(/[()\[\]{}]/g, "") // Remove brackets
    .replace(/TRAIN\/DATE-.*?SS\)/g, "") // Remove malformed train dates
    .replace(/\bTRANSFER-TO\b/gi, "Transfer to") // Normalize transfer text
    .replace(/[^\w\s\-\/.@]/g, "") // Remove remaining special characters
    .replace(/\s+/g, " ") // Remove extra spaces
    .trim()
    .substring(0, 100); // Limit length

  return cleaned;
}

/**
 * Parse amount string to number
 */
function parseAmount(amountStr) {
  if (!amountStr || amountStr.trim() === "") return null;

  const cleaned = amountStr.replace(/[^0-9.-]/g, "");
  const amount = parseFloat(cleaned);

  return isNaN(amount) ? null : Math.abs(amount);
}

/**
 * Extract transactions from bank statement using AI
 * @param {string} statementText - Raw bank statement text
 * @returns {Promise<Array>} Array of extracted transactions
 */
async function extractTransactionsWithAI(statementText) {
  const prompt = `You are a financial expert at extracting transaction data from bank statements.

Analyze the following bank statement and extract ALL transactions.

RULES:
1. Extract only valid transactions (ignore headers, footers, totals, and metadata)
2. Parse dates in any format (convert to YYYY-MM-DD)
3. Extract description (clean and meaningful)
4. Extract amount (as absolute number)
5. Determine type: "income" for credits/deposits, "expense" for debits/withdrawals
6. Auto-categorize based on description keywords
7. Ignore incomplete or invalid rows

BANK STATEMENT TEXT:
${statementText}

Return ONLY a valid JSON array of transactions. No explanation text, no markdown formatting.
Each transaction should have: date, description, amount, type, category

Format:
[
  {
    "date": "YYYY-MM-DD",
    "description": "cleaned description",
    "amount": number,
    "type": "income" or "expense",
    "category": "category name"
  }
]`;

  try {
    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Extract JSON from response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error("No JSON found in AI response");
      return [];
    }

    const transactions = JSON.parse(jsonMatch[0]);

    // Validate and clean transactions
    return Array.isArray(transactions)
      ? transactions.filter((tx) => validateTransaction(tx))
      : [];
  } catch (error) {
    console.error("Error in AI extraction:", error);
    throw new Error(`Failed to extract transactions: ${error.message}`);
  }
}

/**
 * Validate transaction object
 */
function validateTransaction(tx) {
  return (
    tx &&
    typeof tx === "object" &&
    tx.date &&
    typeof tx.date === "string" &&
    tx.date.match(/^\d{4}-\d{2}-\d{2}$/) &&
    tx.description &&
    typeof tx.description === "string" &&
    typeof tx.amount === "number" &&
    tx.amount > 0 &&
    (tx.type === "income" || tx.type === "expense") &&
    tx.category &&
    typeof tx.category === "string"
  );
}

/**
 * Fallback rule-based extraction (if AI fails)
 */
function extractTransactionsRuleBased(statementText) {
  const transactions = [];
  const lines = statementText.split("\n");

  // Pattern to match transaction rows
  const txPattern =
    /(\d{1,2}\/\d{1,2}\/\d{4})\s*\|\s*([^|]+)\s*\|\s*([0-9,.-]*)\s*\|\s*([0-9,.-]*)/;

  for (const line of lines) {
    const match = line.match(txPattern);
    if (match) {
      const [, dateStr, description, debitStr, creditStr] = match;

      const date = parseDate(dateStr);
      if (!date) continue;

      // Skip malformed descriptions (e.g., with date-time patterns)
      if (/TRAIN\/DATE-|TRAINTIME|MM\d+|HH\:SS/.test(description)) {
        continue;
      }

      const debit = parseAmount(debitStr);
      const credit = parseAmount(creditStr);

      let amount = 0;
      let type = "expense";

      if (credit && credit > 0) {
        amount = credit;
        type = "income";
      } else if (debit && debit > 0) {
        amount = debit;
        type = "expense";
      }

      if (amount <= 0) continue;

      const cleanDesc = cleanDescription(description);
      
      // Skip if description is empty after cleaning
      if (!cleanDesc || cleanDesc.trim().length === 0) {
        continue;
      }

      const category = detectCategory(cleanDesc);

      transactions.push({
        date,
        description: cleanDesc,
        amount,
        type,
        category,
      });
    }
  }

  return transactions;
}

/**
 * Main parser function - uses AI with fallback to rule-based
 */
async function parseStatement(statementText) {
  if (!statementText || typeof statementText !== "string") {
    throw new Error("Invalid statement text provided");
  }

  try {
    // Try AI extraction first
    console.log("Attempting AI-powered extraction...");
    const aiTransactions = await extractTransactionsWithAI(statementText);

    if (aiTransactions.length > 0) {
      console.log(`Successfully extracted ${aiTransactions.length} transactions using AI`);
      return aiTransactions;
    }

    // Fallback to rule-based if AI returns empty
    console.log("AI returned no transactions, falling back to rule-based extraction...");
    const ruleTransactions = extractTransactionsRuleBased(statementText);
    console.log(
      `Extracted ${ruleTransactions.length} transactions using rule-based parser`
    );
    return ruleTransactions;
  } catch (error) {
    console.error("AI extraction failed, using rule-based parser:", error.message);
    const ruleTransactions = extractTransactionsRuleBased(statementText);
    return ruleTransactions;
  }
}

export {
  parseStatement,
  extractTransactionsWithAI,
  extractTransactionsRuleBased,
  detectCategory,
  parseDate,
  cleanDescription,
  parseAmount,
  validateTransaction,
};
