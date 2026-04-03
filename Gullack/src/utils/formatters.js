export const formatCurrency = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })

export const exportToCSV = (transactions) => {
  const headers = ['Date', 'Name', 'Category', 'Type', 'Amount']
  const rows = transactions.map(t => [t.date, t.name, t.category, t.type, t.amount])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'finova_transactions.csv'; a.click()
  URL.revokeObjectURL(url)
}