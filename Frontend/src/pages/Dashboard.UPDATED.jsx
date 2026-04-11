import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardSummary } from '../features/transactions/transactionsSlice';
import StatCard from '../components/ui/StatCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import BudgetTracker from '../components/dashboard/BudgetTracker';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { dashboard, loading, error } = useSelector(state => state.transactions);
  const { user } = useSelector(state => state.auth);

  // Fetch dashboard data when component mounts
  useEffect(() => {
    // This will make API call to /api/dashboard/summary
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-400">Error loading dashboard: {error}</p>
        <button onClick={() => dispatch(fetchDashboardSummary())} className="mt-4 px-4 py-2 bg-primary rounded-lg">
          Retry
        </button>
      </div>
    );
  }

  // Extract data from API response
  const summary = dashboard.summary || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">Welcome back, {user?.name || 'User'}! 👋</h1>
        <p className="text-muted-foreground mt-2">Here's your financial overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Balance Card */}
        {loading ? (
          <SkeletonCard />
        ) : (
          <StatCard
            title="Total Balance"
            value={`₹${summary.totalBalance?.toLocaleString() || 0}`}
            subtext={`Income: ₹${summary.totalIncome?.toLocaleString() || 0}`}
            trend="neutral"
            icon="💰"
          />
        )}

        {/* Income Card */}
        {loading ? (
          <SkeletonCard />
        ) : (
          <StatCard
            title="Total Income"
            value={`₹${summary.totalIncome?.toLocaleString() || 0}`}
            subtext={`This month: ₹${summary.thisMonthIncome?.toLocaleString() || 0}`}
            trend="up"
            icon="📈"
          />
        )}

        {/* Expense Card */}
        {loading ? (
          <SkeletonCard />
        ) : (
          <StatCard
            title="Total Expense"
            value={`₹${summary.totalExpense?.toLocaleString() || 0}`}
            subtext={`This month: ₹${summary.thisMonthExpense?.toLocaleString() || 0}`}
            trend="down"
            icon="📉"
          />
        )}
      </div>

      {/* Budget and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="p-6 bg-card rounded-xl border text-center">
              Loading recent transactions...
            </div>
          ) : (
            <RecentTransactions transactions={summary.recentTransactions || []} />
          )}
        </div>
        <div>
          {loading ? (
            <SkeletonCard />
          ) : (
            <BudgetTracker />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
