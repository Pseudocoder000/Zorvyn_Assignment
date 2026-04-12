/**
 * 🔥 Gemini REST API Parser - Direct HTTP approach
 */

import dotenv from "dotenv";

dotenv.config();

/**
 * Parse bank statement using Gemini REST API
 */
export async function parseWithGemini(statementText) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY not set in .env");
    }

    const prompt = `You are a financial data extractor. Read this bank statement and extract ONLY transaction data.

Bank Statement:
${statementText}

IMPORTANT RULES:
1. Extract ONLY transactions (ignore headers, footers, logos, page numbers)
2. Each transaction needs: date, description, amount, type, category
3. Date format: YYYY-MM-DD (convert from any format)
4. Amount: positive number (absolute value)
5. Type: "income" (credits) or "expense" (debits)
6. Category: MUST be one of: Shopping, Education, Healthcare, Groceries, Entertainment, Transport, Utilities, Investment, Salary, Other
   - If unclear, use "Other"
   - Food/Restaurant → Groceries
   - Travel/Taxi/Uber → Transport
   - Movie/Games → Entertainment
   - Doctor/Medicine → Healthcare
7. Ignore incomplete or invalid rows
8. Description: Clean text, remove codes/symbols

Return ONLY valid JSON array. NO explanations.
Format:
[
  {
    "date": "YYYY-MM-DD",
    "description": "clean text",
    "amount": number,
    "type": "income" or "expense",
    "category": "Shopping|Education|Healthcare|Groceries|Entertainment|Transport|Utilities|Investment|Salary|Other"
  }
]`;

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      return [];
    }

    const data = await response.json();

    // Extract text from response
    let responseText = "";
    if (
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0]
    ) {
      responseText = data.candidates[0].content.parts[0].text;
    }

    // Extract JSON from response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.log("No valid transactions found in response");
      return [];
    }

    const transactions = JSON.parse(jsonMatch[0]);

    // Transform and validate transactions
    const validCategories = ["Shopping", "Education", "Healthcare", "Groceries", "Entertainment", "Transport", "Utilities", "Investment", "Salary", "Other"];
    
    return Array.isArray(transactions)
      ? transactions
          .map(tx => {
            const normalizedCategory = normalizeCategoryToEnum(tx.category, validCategories);
            const transformed = {
              date: tx.date,
              name: tx.description, // Map description to name for schema
              description: tx.description, // Keep description too
              amount: tx.amount,
              type: tx.type,
              category: normalizedCategory
            };
            // Debug logging
            if (tx.category !== normalizedCategory) {
              console.log(`  Normalized category: "${tx.category}" → "${normalizedCategory}"`);
            }
            return transformed;
          })
          .filter(tx => validateTransaction(tx, validCategories))
      : [];
  } catch (error) {
    console.error("Gemini parsing error:", error.message);
    return [];
  }
}

/**
 * Normalize category to valid enum value
 */
function normalizeCategoryToEnum(category, validCategories) {
  if (!category) return "Other";
  
  // Clean and normalize input
  let cleanCategory = String(category).trim();
  
  // If already valid, return as-is
  if (validCategories.includes(cleanCategory)) return cleanCategory;
  
  const categoryLower = cleanCategory.toLowerCase();
  
  // Direct exact match (case-insensitive)
  for (const valid of validCategories) {
    if (valid.toLowerCase() === categoryLower) {
      return valid;
    }
  }
  
  // Map common variations to valid categories - PRIORITY ORDER MATTERS
  const categoryMappings = [
    // Exact phrase matches first
    { pattern: /food\s*&\s*dining/i, category: "Groceries" },
    { pattern: /food\s*&\s*groceries/i, category: "Groceries" },
    { pattern: /dining\s*&\s*food/i, category: "Groceries" },
    
    // Food & Restaurant related
    { pattern: /food|restaurant|dining|grocery|groceries|supermarket|mall|cafe|pizza|burger|milk|vegetable|meat|chicken|rice|flour|snacks|bakery/i, category: "Groceries" },
    
    // Shopping related
    { pattern: /shopping|shop|amazon|flipkart|store|purchase|clothing|apparel|shoes|mall|retail|brand/i, category: "Shopping" },
    
    // Entertainment related
    { pattern: /entertainment|movie|cinema|pvr|netflix|spotify|games|gaming|play|music|hobby|outing|concert/i, category: "Entertainment" },
    
    // Transport related
    { pattern: /transport|taxi|uber|travel|train|bus|flight|petrol|gas|car|vehicle|auto|metro|railway|bike|fuel/i, category: "Transport" },
    
    // Utilities related
    { pattern: /utilit|electric|water|internet|mobile|phone|broadband|postpaid|bill|subscription|wifi|dsl/i, category: "Utilities" },
    
    // Healthcare related
    { pattern: /health|medical|doctor|hospital|clinic|medicine|drug|pharmacy|dental|surgery|treatment|lab|vaccine/i, category: "Healthcare" },
    
    // Education related
    { pattern: /education|school|college|university|course|training|tuition|exam|book|study|learning|institute/i, category: "Education" },
    
    // Investment related
    { pattern: /invest|stock|mutual|fund|share|trading|insurance|premium|deposit|saving/i, category: "Investment" },
    
    // Salary/Income related
    { pattern: /salary|income|wage|payment|transfer|earning|credited|bonus|allowance|freelance|consulting/i, category: "Salary" },
  ];
  
  // Check pattern matches
  for (const mapping of categoryMappings) {
    if (mapping.pattern.test(categoryLower)) {
      return mapping.category;
    }
  }
  
  // Default to Other if no match found
  console.warn(`⚠️ Category "${category}" not recognized, using "Other"`);
  return "Other";
}

/**
 * Validate transaction object
 */
function validateTransaction(tx, validCategories) {
  return (
    tx &&
    typeof tx === "object" &&
    tx.date &&
    typeof tx.date === "string" &&
    tx.date.match(/^\d{4}-\d{2}-\d{2}$/) &&
    tx.name &&
    typeof tx.name === "string" &&
    typeof tx.amount === "number" &&
    tx.amount > 0 &&
    (tx.type === "income" || tx.type === "expense") &&
    tx.category &&
    validCategories.includes(tx.category)
  );
}

export default parseWithGemini;
