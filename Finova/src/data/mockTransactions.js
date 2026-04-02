export const CATEGORIES = [
  "Shopping", "Education", "Healthcare", "Groceries",
  "Entertainment", "Transport", "Utilities", "Investment", "Salary", "Other"
]

export const CATEGORY_COLORS = {
  Shopping:      "#f97316",
  Education:     "#22d3ee",
  Healthcare:    "#10b981",
  Groceries:     "#eab308",
  Entertainment: "#ec4899",
  Transport:     "#8b5cf6",
  Utilities:     "#6b7280",
  Investment:    "#3b82f6",
  Salary:        "#14b8a6",
  Other:         "#94a3b8",
}

const names = {
  Shopping:      ["Amazon", "Target", "Zara", "H&M", "Flipkart"],
  Education:     ["Udemy", "Coursera", "Workshop", "Books", "Skillshare"],
  Healthcare:    ["Apollo Pharmacy", "City Hospital", "Lab Tests", "Dental Clinic"],
  Groceries:     ["BigBasket", "D-Mart", "Reliance Fresh", "Zepto"],
  Entertainment: ["Netflix", "Spotify", "BookMyShow", "Steam"],
  Transport:     ["Uber", "Ola", "Metro Card", "Fuel"],
  Utilities:     ["Electricity Bill", "Water Bill", "Internet", "Gas"],
  Investment:    ["Stock Returns", "Mutual Fund", "Crypto", "FD Interest"],
  Salary:        ["Salary Payment", "Freelance Payment", "Bonus"],
  Other:         ["Miscellaneous", "Transfer", "ATM Withdrawal"],
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateDate(daysAgo) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().split('T')[0]
}

let idCounter = 1
function makeTransaction(daysAgo) {
  const isIncome = Math.random() > 0.72
  const category = isIncome
    ? (Math.random() > 0.4 ? "Salary" : "Investment")
    : CATEGORIES.filter(c => !["Salary","Investment"].includes(c))[randomBetween(0,7)]
  const nameList = names[category]
  return {
    id: `txn_${idCounter++}`,
    name: nameList[randomBetween(0, nameList.length - 1)],
    date: generateDate(daysAgo),
    amount: isIncome ? randomBetween(500, 8000) : randomBetween(20, 500),
    type: isIncome ? "income" : "expense",
    category,
  }
}

export const mockTransactions = Array.from({ length: 90 }, (_, i) =>
  makeTransaction(Math.floor(i / 2))
).sort((a, b) => new Date(b.date) - new Date(a.date))