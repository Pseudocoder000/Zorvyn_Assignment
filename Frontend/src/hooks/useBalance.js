import { useMemo } from 'react'
import { useSelector } from 'react-redux'

/**
 * Custom hook for calculating balance metrics
 * Integrates dashboard summary with user's initialBalance
 * 
 * Returns:
 *   - totalBalance: initialBalance + (total income - total expense)
 *   - totalIncome: sum of all income transactions
 *   - totalExpense: sum of all expense transactions
 *   - thisMonthBalance: initialBalance + (this month income - this month expense)
 *   - thisMonthIncome, thisMonthExpense
 */
export const useBalance = () => {
  const user = useSelector((s) => s.auth.user)
  const dashboard = useSelector((s) => s.transactions.dashboard)

  const balanceMetrics = useMemo(() => {
    const initialBalance = user?.initialBalance || 0
    const summary = dashboard?.summary || {}

    // Transaction-based calculations
    const transactionBalance = (summary.totalIncome || 0) - (summary.totalExpense || 0)
    const monthlyTransactionBalance =
      (summary.thisMonthIncome || 0) - (summary.thisMonthExpense || 0)

    return {
      // Total balance including initialBalance
      totalBalance: initialBalance + transactionBalance,
      totalIncome: summary.totalIncome || 0,
      totalExpense: summary.totalExpense || 0,

      // This month metrics
      thisMonthBalance: initialBalance + monthlyTransactionBalance,
      thisMonthIncome: summary.thisMonthIncome || 0,
      thisMonthExpense: summary.thisMonthExpense || 0,

      // Additional useful metrics
      initialBalance,
      transactionBalance,
      monthlyTransactionBalance,

      // Recent transactions (last 5)
      recentTransactions: summary.recentTransactions || [],
    }
  }, [user?.initialBalance, dashboard?.summary])

  return balanceMetrics
}

/**
 * Alternative hook for calculating balance from raw transaction data
 * Use when dashboard summary is not available or you need detailed control
 */
export const useBalanceFromTransactions = (transactions = []) => {
  const user = useSelector((s) => s.auth.user)

  const balanceMetrics = useMemo(() => {
    const initialBalance = user?.initialBalance || 0

    // Calculate totals from transactions
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + (t.amount || 0), 0)

    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + (t.amount || 0), 0)

    return {
      totalBalance: initialBalance + totalIncome - totalExpense,
      totalIncome,
      totalExpense,
      initialBalance,
      transactionCount: transactions.length,
    }
  }, [transactions, user?.initialBalance])

  return balanceMetrics
}

export default useBalance
