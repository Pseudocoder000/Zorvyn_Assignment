import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'   

import {
  ArrowRight, Bot, Brain, CreditCard, LineChart,
  MessageCircle, Moon, PieChart, Shield, Sparkles,
  Star, Sun, TrendingUp, Users, Wallet
} from 'lucide-react'

import gullak from "../stickers/gullak.png"
import { toggleTheme } from '../features/theme/themeSlice'

const Landing = () => {
  const mode = useSelector((state) => state.theme.mode)
  const dispatch = useDispatch()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark')
  }, [mode])

  return (
    <div className="min-h-screen bg-background text-foreground pt-16"> 

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full h-16 z-50 bg-background/80 backdrop-blur-xl border-b border-white/[0.05]"> {/* ✅ FIXED */}
        <div className="flex items-center justify-between px-3 md:px-6 h-full">

          {/* LEFT */}
         <div className="flex items-center gap-3 px-2">
                 {/* <div className="w-9 h-9 rounded-2xl gb flex items-center justify-center shrink-0"> */}
                 <div className="w-16 h-9 rounded-2xl flex items-center justify-center shrink-0">
                   {/* <TrendingUp size={16} className="text-white" /> */}
                   <img src={gullak} alt="logo" />
                 </div>
                 <span className="text-2xl font-extrabold gt">Gullak</span>
               </div>

           {/* FLOATING GULLAK */}
        <div className="hidden md:block absolute left-[20%] right-[10%] h-full pointer-events-none">
          <motion.img
            src={gullak}
            alt="pig"
            className="w-12 opacity-80"
            animate={{
              x: ["-40%", "40%", "-40%"],
              y: [0, -5, 0],
              rotate: [-10, 10, -10]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {/* Theme Toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="w-8 h-8 md:w-9 md:h-9 rounded-xl border border-white/[0.06] bg-white/[0.09] flex items-center justify-center text-white/60 hover:text-amber-400 transition"
            >
              {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Login */}
            <Link to="/login">
              <button className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-lg border border-white/[0.08] hover:bg-white/[0.04] transition">
                Log in
              </button>
            </Link>

            {/* Get Started */}
            <Link to="/signup">
              <button className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-lg gradient-primary text-primary-foreground flex items-center gap-1">
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-42 pb-30 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Sparkles className="w-7 h-7" /> AI-Powered Finance Tracking
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            Your Money, <span className="text-primary">Smarter.</span>
            <br />
            <span className="text-muted-foreground">With AI by Your Side.</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Gullak connects to your bank, tracks every rupee, and gives you an AI financial advisor that helps you save more, spend wisely, and grow your wealth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <button type="button" className="gradient-primary text-primary-foreground text-base px-8 h-12 rounded-xl inline-flex items-center justify-center gap-2">
                Show Demo <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </Link>
            <a href="#features">
              <button type="button" className="text-base px-12 h-12 rounded-xl border border-border/50 hover:bg-muted transition-colors">
                See How It Works
              </button>
            </a>
          </div>
          {/* Dashboard Preview */}
          <div className="mt-20 relative">
            <div className="glass-card rounded-3xl p-8 sm:p-8 shadow-2xl shadow-primary/10">
              <div className="bg-card rounded-xl p-4 sm:p-6 border border-border/50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4">
                  {[
                    { label: 'Total Balance', value: '₹8,33,041', color: 'text-foreground', icon: Wallet },
                    { label: 'Income This Month', value: '₹1,35,350', color: 'text-[hsl(var(--income))]', icon: TrendingUp },
                    { label: 'Expenses', value: '₹54,230', color: 'text-[hsl(var(--expense))]', icon: CreditCard },
                    { label: 'Savings Rate', value: '60%', color: 'text-primary', icon: PieChart },
                  ].map((card) => (
                    <div key={card.label} className="bg-muted/50 rounded-lg p-3 sm:p-4">
                      <card.icon className={`w-5 h-5 ${card.color} mb-2`} />
                      <p className={`text-lg sm:text-xl font-bold ${card.color}`}>{card.value}</p>
                      <p className="text-xs text-muted-foreground">{card.label}</p>
                    </div>
                  ))}
                </div>
                <div className="h-32 bg-muted/30 rounded-lg flex items-center justify-center">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <LineChart className="w-5 h-5" />
                    <span className="text-sm">Live Balance Trend</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything You Need to <span className="text-primary">Master Your Money</span></h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">From tracking expenses to investing smarter — Gullak has you covered.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { icon: CreditCard, title: 'Bank Account Sync', desc: 'Connect your bank accounts and see exactly where every rupee goes. Automatic categorization of all transactions.', color: 'text-primary' },
              { icon: Bot, title: 'AI Finance Chatbot', desc: 'Ask anything about budgeting, mutual funds, tax saving, or investment strategies. Your personal finance advisor, 24/7.', color: 'text-[hsl(var(--income))]' },
              { icon: PieChart, title: 'Spending Analytics', desc: 'Visual breakdowns of your spending patterns by category, time period, and trends. Know where your money leaks.', color: 'text-[hsl(var(--chart-3))]' },
              { icon: TrendingUp, title: 'Mutual Fund Insights', desc: 'Get personalized mutual fund recommendations based on your risk profile and financial goals.', color: 'text-[hsl(var(--chart-4))]' },
              { icon: Shield, title: 'Smart Budgets', desc: 'Set category-wise budgets and get alerts before you overspend. AI suggests optimal budgets based on your income.', color: 'text-[hsl(var(--chart-5))]' },
              { icon: Brain, title: 'Financial Health Score', desc: 'A comprehensive score based on your savings, debt, investments, and spending habits. Track your progress over time.', color: 'text-[hsl(var(--chart-6))]' },
            ].map((f) => (
              <div key={f.title} className="glass-card hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
                <div className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <f.icon className={`w-6 h-6 ${f.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant Section */}
      <section id="ai-assistant" className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
                <Bot className="w-6 h-6" /> AI-Powered
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Your Personal <span className="text-primary">Finance AI</span></h2>
              <p className="text-muted-foreground text-lg mb-6">
                Ask Gullak anything about your finances. It understands your spending, knows your goals, and gives actionable advice.
              </p>
              <div className="space-y-16">
                {[
                  '"How much did I spend on food this month?"',
                  '"Should I invest in index funds or ELSS?"',
                  '"Help me create a budget to save ₹50,000/month"',
                  '"Where am I overspending compared to last month?"',
                ].map((q) => (
                  <div key={q} className="flex items-start gap-3">
                    <MessageCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-muted-foreground">{q}</span>
                  </div>
                ))}
              </div>
              <Link to="/signup" className="inline-block mt-8">
                <button type="button" className="gradient-primary text-primary-foreground rounded-xl inline-flex items-center gap-2 px-5 py-3">
                  Try AI Assistant <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </Link>
            </div>
            {/* Chat Preview */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Gullak AI</p>
                  <p className="text-s text-muted-foreground">Your finance assistant</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="bg-muted rounded-xl rounded-tl-lg p-5 max-w-[80%]">
                  <p className="text-xl">Where am I spending the most money? 🤔</p>
                </div>
                <div className="bg-primary/10 rounded-xl rounded-tr-sm p-5 max-w-[85%] ml-auto">
                  <p className="text-sm">Based on your last 3 months, your top spending categories are:</p>
                  <ul className="text-lg mt-4 space-y-3">
                    <li>🍕 Food & Dining — ₹12,450/mo</li>
                    <li>🚗 Transport — ₹8,200/mo</li>
                    <li>🛍️ Shopping — ₹6,800/mo</li>
                  </ul>
                  <p className="text-sm mt-2">I recommend reducing dining out by 20% — that alone could save you <strong className="text-[hsl(var(--income))]">₹2,490/mo</strong>!</p>
                </div>
                <div className="bg-muted rounded-xl rounded-tl-sm p-3 max-w-[80%]">
                  <p className="text-xl">Which mutual fund should I invest in?</p>
                </div>
                <div className="bg-primary/10 rounded-xl rounded-tr-sm p-3 max-w-[85%] ml-auto">
                  <p className="text-l">Based on your risk profile (moderate) and ₹15K/mo SIP budget, I suggest:</p>
                  <ul className="text-lg mt-2 space-y-1">
                    <li>📈 Nifty 50 Index Fund — 40%</li>
                    <li>📊 Flexi Cap Fund — 35%</li>
                    <li>🏦 ELSS for Tax Saving — 25%</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

<footer className="border-t border-border/50 py-10 px-4">


        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <div className="w-16 h-9 rounded-2xl flex items-center justify-center shrink-0">
                   {/* <TrendingUp size={16} className="text-white" /> */}
                   <img src={gullak} alt="logo" />
                 </div>
                 <span className="text-2xl font-extrabold gt">Gullak</span>
               </div>
          <div className="flex gap-6 text-l text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#ai-assistant" className="hover:text-foreground transition-colors">AI Assistant</a>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Gullak. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Landing