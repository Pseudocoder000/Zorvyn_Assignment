export const CATEGORIES = [
  "Shopping", "Education", "Healthcare", "Groceries",
  "Entertainment", "Transport", "Utilities", "Investment", "Salary", "Other"
]

export const CATEGORY_COLORS = {
  Shopping:      "#f87171",
  Education:     "#14b8a6",
  Healthcare:    "#10b981",
  Groceries:     "#fbbf24",
  Entertainment: "#f472b6",
  Transport:     "#818cf8",
  Utilities:     "#94a3b8",
  Investment:    "#2dd4bf",
  Salary:        "#34d399",
  Other:         "#64748b",
}

export const BUDGET_LIMITS = {
  Shopping:      15000,
  Education:     10000,
  Healthcare:    8000,
  Groceries:     12000,
  Entertainment: 6000,
  Transport:     5000,
  Utilities:     4000,
  Investment:    20000,
  Other:         6000,
}

const names = {
  Shopping:      ["Amazon", "Myntra", "Zara", "H&M", "Flipkart"],
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
    : CATEGORIES.filter(c => !["Salary", "Investment"].includes(c))[randomBetween(0, 7)]
  const nameList = names[category]
  return {
    id: `txn_${idCounter++}`,
    name: nameList[randomBetween(0, nameList.length - 1)],
    date: generateDate(daysAgo),
    amount: isIncome ? randomBetween(25000, 120000) : randomBetween(200, 8000),
    type: isIncome ? "income" : "expense",
    category,
  }
}

export const mockTransactions = Array.from({ length: 90 }, (_, i) =>
  makeTransaction(Math.floor(i / 2))
).sort((a, b) => new Date(b.date) - new Date(a.date))