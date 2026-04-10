import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Wallet, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { signupRequest } from '../utils/api'

const Signup = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    if (!name || !email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      await signupRequest(name, email, password)
      toast.success('Account created successfully!')
      navigate('/login')
    } catch (error) {
      toast.error(error.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-base text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div className="glass-card rounded-3xl p-6 shadow-2xl shadow-primary/10 backdrop-blur-xl border border-border/50">

          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-3">
              <Wallet className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-semibold">Create your account</h1>
            <p className="text-base text-muted-foreground mt-2">
              Sign up and start managing your finances with Gullak.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">

            {/* NAME */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-base font-medium text-foreground">
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full rounded-2xl border border-border/50 bg-white/5 px-4 py-3 text-base text-white placeholder:text-gray-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white/10"
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-base font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-border/50 bg-white/5 px-4 py-3 text-base text-white placeholder:text-gray-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white/10"
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-2 relative">
              <label htmlFor="password" className="block text-base font-medium text-foreground">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a secure password"
                className="w-full rounded-2xl border border-border/50 bg-white/5 px-4 py-3 text-base text-white placeholder:text-gray-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white/10"
              />
              <button
                type="button"
                className="absolute right-4 top-12 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-primary px-4 py-3 text-base font-semibold text-primary-foreground transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>

          </form>

          <p className="text-center text-base text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Signup