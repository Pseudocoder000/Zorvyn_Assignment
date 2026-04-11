import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'   

import {
  ArrowRight, Bot, Brain, CreditCard, LineChart,
  MessageCircle, Moon, PieChart, Shield, Sparkles,
  Star, Sun, TrendingUp, Users, Wallet, CheckCircle
} from 'lucide-react'

import gullak from "../stickers/gullak.png"
import { toggleTheme } from '../features/theme/themeSlice'

const Landing = () => {
  const mode = useSelector((state) => state.theme.mode)
  const dispatch = useDispatch()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark')
  }, [mode])

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const featureCardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    hover: {
      y: -8,
      boxShadow: "0 20px 40px rgba(var(--primary), 0.15)",
      transition: { duration: 0.3 },
    },
  }



  const slideInVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const slideInRightVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 text-foreground pt-16"> 

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
        <div className="hidden md:block absolute left-[30%] right-[10%] h-full pointer-events-none">
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
      <section className="pt-20 pb-30 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        <motion.div 
          className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-primary/5 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6 border border-primary/30"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
            AI-Powered Finance Tracking
          </motion.div>

          <motion.h1 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6"
          >
            <motion.span variants={itemVariants} className="block">
              Your Money,
            </motion.span>
            <motion.span 
              variants={itemVariants}
              className="block bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"
            >
              Smarter.
            </motion.span>
            <motion.span variants={itemVariants} className="block text-muted-foreground text-3xl sm:text-4xl lg:text-5xl">
              With AI by Your Side.
            </motion.span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Gullak connects to your bank, tracks every rupee, and gives you an AI financial advisor that helps you save more, spend wisely, and grow your wealth.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link to="/demo">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(var(--primary), 0.3)" }}
                whileTap={{ scale: 0.95 }}
                type="button" 
                className="gradient-primary text-primary-foreground text-base px-8 h-12 rounded-xl inline-flex items-center justify-center gap-2 font-medium shadow-lg"
              >
                Show Demo 
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.button>
            </Link>
            <a href="#features">
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.95 }}
                type="button" 
                className="text-base px-12 h-12 rounded-xl border border-primary/30 hover:bg-primary/5 transition-colors font-medium"
              >
                See How It Works
              </motion.button>
            </a>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div 
            className="mt-20 relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <motion.div 
              className="glass-card rounded-3xl p-8 sm:p-8 shadow-2xl shadow-primary/20 border border-primary/10"
              whileHover={{ y: -10, boxShadow: "0 40px 80px rgba(var(--primary), 0.25)" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="bg-gradient-to-br from-card to-card/50 rounded-xl p-4 sm:p-6 border border-primary/10">
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {[
                    { label: 'Total Balance', value: '₹8,33,041', color: 'text-foreground', icon: Wallet },
                    { label: 'Income This Month', value: '₹1,35,350', color: 'text-emerald-500', icon: TrendingUp },
                    { label: 'Expenses', value: '₹54,230', color: 'text-red-500', icon: CreditCard },
                    { label: 'Savings Rate', value: '60%', color: 'text-primary', icon: PieChart },
                  ].map((card) => (
                    <motion.div 
                      key={card.label} 
                      variants={itemVariants}
                      whileHover={{ y: -5, scale: 1.05 }}
                      className="bg-gradient-to-br from-muted/50 to-muted/20 rounded-lg p-3 sm:p-4 border border-white/5 cursor-pointer"
                    >
                      <card.icon className={`w-5 h-5 ${card.color} mb-2`} />
                      <p className={`text-lg sm:text-xl font-bold ${card.color}`}>{card.value}</p>
                      <p className="text-xs text-muted-foreground">{card.label}</p>
                    </motion.div>
                  ))}
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="h-32 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg flex items-center justify-center border border-primary/10"
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <LineChart className="w-5 h-5" />
                    </motion.div>
                    <span className="text-sm">Live Balance Trend</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Master Your Money</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">From tracking expenses to investing smarter — Gullak has you covered.</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              { icon: CreditCard, title: 'Bank Account Sync', desc: 'Connect your bank accounts and see exactly where every rupee goes. Automatic categorization of all transactions.', color: 'text-primary', gradient: 'from-primary/20 to-primary/5' },
              { icon: Bot, title: 'AI Finance Chatbot', desc: 'Ask anything about budgeting, mutual funds, tax saving, or investment strategies. Your personal finance advisor, 24/7.', color: 'text-emerald-500', gradient: 'from-emerald-500/20 to-emerald-500/5' },
              { icon: PieChart, title: 'Spending Analytics', desc: 'Visual breakdowns of your spending patterns by category, time period, and trends. Know where your money leaks.', color: 'text-blue-500', gradient: 'from-blue-500/20 to-blue-500/5' },
              { icon: TrendingUp, title: 'Mutual Fund Insights', desc: 'Get personalized mutual fund recommendations based on your risk profile and financial goals.', color: 'text-purple-500', gradient: 'from-purple-500/20 to-purple-500/5' },
              { icon: Shield, title: 'Smart Budgets', desc: 'Set category-wise budgets and get alerts before you overspend. AI suggests optimal budgets based on your income.', color: 'text-orange-500', gradient: 'from-orange-500/20 to-orange-500/5' },
              { icon: Brain, title: 'Financial Health Score', desc: 'A comprehensive score based on your savings, debt, investments, and spending habits. Track your progress over time.', color: 'text-pink-500', gradient: 'from-pink-500/20 to-pink-500/5' },
            ].map((f, index) => (
              <motion.div 
                key={f.title} 
                variants={featureCardVariants}
                whileHover="hover"
                className={`glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-primary/20 transition-colors group cursor-pointer bg-gradient-to-br ${f.gradient}`}
              >
                <div className="p-6">
                  <motion.div 
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} border border-white/10 flex items-center justify-center mb-4`}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <f.icon className={`w-6 h-6 ${f.color}`} />
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="mt-4 flex items-center gap-2 text-primary text-sm font-medium"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Included in all plans</span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* AI Assistant Section */}
      <section id="ai-assistant" className="py-20 px-4 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInVariants}
            >
              <motion.div 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-primary/5 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4 border border-primary/30"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Bot className="w-5 h-5" />
                </motion.div>
                AI-Powered
              </motion.div>
              
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Your Personal <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Finance AI</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                Ask Gullak anything about your finances. It understands your spending, knows your goals, and gives actionable advice.
              </p>

              <motion.div 
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  '"How much did I spend on food this month?"',
                  '"Should I invest in index funds or ELSS?"',
                  '"Help me create a budget to save ₹50,000/month"',
                  '"Where am I overspending compared to last month?"',
                ].map((q, index) => (
                  <motion.div 
                    key={q} 
                    variants={itemVariants}
                    whileHover={{ x: 10 }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ delay: index * 0.1, duration: 1.5, repeat: Infinity }}
                    >
                      <MessageCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    </motion.div>
                    <span className="text-sm text-muted-foreground">{q}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                viewport={{ once: true }}
              >
                <Link to="/signup" className="inline-block mt-8">
                  <motion.button 
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(var(--primary), 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    type="button" 
                    className="gradient-primary text-primary-foreground rounded-xl inline-flex items-center gap-2 px-6 py-3 font-medium shadow-lg"
                  >
                    Try AI Assistant 
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Chat Preview */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInRightVariants}
              className="glass-card rounded-2xl p-6 space-y-4 border border-primary/10 bg-gradient-to-br from-card/80 to-card/40"
            >
              <motion.div 
                className="flex items-center gap-3 pb-4 border-b border-primary/20"
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </motion.div>
                <div>
                  <p className="font-semibold text-lg">Gullak AI</p>
                  <p className="text-s text-muted-foreground">Your finance assistant</p>
                </div>
              </motion.div>

              <motion.div 
                className="space-y-3"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div 
                  variants={itemVariants}
                  className="bg-muted/50 rounded-2xl rounded-bl-sm p-4 max-w-[80%] border border-white/5"
                >
                  <p className="text-base">Where am I spending the most money? 🤔</p>
                </motion.div>

                <motion.div 
                  variants={itemVariants}
                  className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl rounded-tr-sm p-4 max-w-[90%] ml-auto border border-primary/20"
                >
                  <p className="text-sm font-medium mb-2">Based on your last 3 months, your top spending categories are:</p>
                  <ul className="text-sm space-y-2 mb-3">
                    <li className="flex items-center gap-2">🍕 <span>Food & Dining — ₹12,450/mo</span></li>
                    <li className="flex items-center gap-2">🚗 <span>Transport — ₹8,200/mo</span></li>
                    <li className="flex items-center gap-2">🛍️ <span>Shopping — ₹6,800/mo</span></li>
                  </ul>
                  <p className="text-sm">I recommend reducing dining out by 20% — that alone could save you <strong className="text-emerald-400">₹2,490/mo</strong>!</p>
                </motion.div>

                <motion.div 
                  variants={itemVariants}
                  className="bg-muted/50 rounded-2xl rounded-bl-sm p-4 max-w-[75%] border border-white/5"
                >
                  <p className="text-base">Which mutual fund should I invest in?</p>
                </motion.div>

                <motion.div 
                  variants={itemVariants}
                  className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl rounded-tr-sm p-4 max-w-[90%] ml-auto border border-primary/20"
                >
                  <p className="text-sm font-medium mb-2">Based on your risk profile (moderate) and ₹15K/mo SIP budget, I suggest:</p>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center gap-2">📈 <span>Nifty 50 Index Fund — 40%</span></li>
                    <li className="flex items-center gap-2">📊 <span>Flexi Cap Fund — 35%</span></li>
                    <li className="flex items-center gap-2">🏦 <span>ELSS for Tax Saving — 25%</span></li>
                  </ul>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 px-4 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 blur-3xl pointer-events-none"
          animate={{
            x: [0, 50, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Master Your Money?</span>
          </motion.h2>

          <motion.p 
            className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Join thousands of Indians who are already using Gullak to take control of their finances and build wealth smarter.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link to="/signup">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(var(--primary), 0.4)" }}
                whileTap={{ scale: 0.95 }}
                type="button" 
                className="gradient-primary text-primary-foreground text-lg px-10 h-14 rounded-xl inline-flex items-center gap-3 font-semibold shadow-2xl"
              >
                Get Started Now
                <motion.div
                  animate={{ x: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* FOOTER */}
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