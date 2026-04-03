import { createSlice, nanoid } from '@reduxjs/toolkit'
import { mockTransactions } from '../../data/mockTransactions'

const saved = localStorage.getItem('finova_transactions')
const initialItems = saved ? JSON.parse(saved) : mockTransactions

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: { items: initialItems, filter: { search: '', type: 'all', category: 'all', sort: 'date', order: 'desc' } },
  reducers: {
    addTransaction: (state, action) => {
      state.items.unshift({ ...action.payload, id: nanoid() })
    },
    deleteTransaction: (state, action) => {
      state.items = state.items.filter(t => t.id !== action.payload)
    },
    setFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload }
    },
    resetFilter: (state) => {
      state.filter = { search: '', type: 'all', category: 'all', sort: 'date', order: 'desc' }
    },
  },
})

export const { addTransaction, deleteTransaction, setFilter, resetFilter } = transactionsSlice.actions
export default transactionsSlice.reducer

export const selectFiltered = state => {
  const { items, filter } = state.transactions
  let result = [...items]
  if (filter.search) result = result.filter(t => t.name.toLowerCase().includes(filter.search.toLowerCase()))
  if (filter.type !== 'all') result = result.filter(t => t.type === filter.type)
  if (filter.category !== 'all') result = result.filter(t => t.category === filter.category)
  result.sort((a, b) => {
    if (filter.sort === 'date') return filter.order === 'desc' ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date)
    if (filter.sort === 'amount') return filter.order === 'desc' ? b.amount - a.amount : a.amount - b.amount
    return 0
  })
  return result
}