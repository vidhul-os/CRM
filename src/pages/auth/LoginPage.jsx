import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useSettingsStore } from '@/stores/settingsStore'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { LogIn, Lock, HelpCircle, Mail, Key, ShieldCheck, CheckCircle, ArrowLeft } from 'lucide-react'
import authApi from '@/api/auth.api'

export default function LoginPage() {
  const [email, setEmail]   = useState('')
  const [pass,  setPass]    = useState('')
  const [error, setError]   = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Forgot Password Flow State
  const [forgotStep, setForgotStep] = useState(null) // null, 'email', 'otp', 'reset', 'success'
  const [forgotEmail, setForgotEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')

  const { login } = useAuthStore()
  const { branding } = useSettingsStore()
  const navigate  = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(email, pass)
    setLoading(false)
    if (result.success) navigate('/crm/dashboard')
    else setError(result.error)
  }

  const handleForgotEmail = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authApi.sendOtp(forgotEmail)
      setForgotStep('otp')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authApi.verifyOtp(forgotEmail, otp)
      setForgotStep('reset')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP code')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (newPass !== confirmPass) {
      setError('Passwords do not match')
      return
    }
    setError('')
    setLoading(true)
    try {
      await authApi.resetPassword(forgotEmail, otp, newPass)
      setForgotStep('success')
      setSuccessMsg('Your password has been reset successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-[-25%] left-[-15%] w-[60%] h-[70%] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[60%] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[420px] animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-20 h-20 bg-indigo-600 rounded-[28px] flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-indigo-600/30 border-4 border-white mb-6 drop-shadow-xl overflow-hidden">
             {branding?.logo ? <img src={branding.logo} alt="Logo" className="w-full h-full object-cover" /> : 'N'}
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter drop-shadow-sm">
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              {branding?.companyName || 'NexusCRM'}
            </span>
          </h1>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-3 opacity-80">Sign in to your account</p>
        </div>

        <div className="bg-white/90 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-indigo-50/50 p-10 ring-1 ring-black/5 min-h-[460px] flex flex-col">
          {!forgotStep ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Please enter your details to continue</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                <Input 
                  label="Email Address" 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)} 
                  required
                  placeholder="name@company.com"
                  icon={LogIn}
                />
                <Input 
                  label="Password" 
                  type="password" 
                  value={pass}
                  onChange={e => setPass(e.target.value)} 
                  required
                  placeholder="••••••••"
                  icon={Lock}
                />

                {error && (
                  <div className="p-4 bg-red-50/50 rounded-2xl border-2 border-red-100 flex items-center gap-3 animate-in shake duration-300">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <p className="text-red-600 text-[11px] font-bold tracking-widest uppercase leading-none">
                      {error}
                    </p>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="w-full h-14 bg-indigo-600 text-white text-base font-bold tracking-tight rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign in to Platform'}
                </button>
              </form>

              <button 
                onClick={() => { setForgotStep('email'); setError(''); }}
                className="mt-8 mx-auto flex items-center gap-2 group text-[10px] font-bold text-gray-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
              >
                <HelpCircle size={14} />
                <span>Forgot your credentials?</span>
              </button>
            </>
          ) : forgotStep === 'email' ? (
            <>
              <div className="mb-0">
                 <button onClick={() => setForgotStep(null)} className="mb-4 text-gray-400 hover:text-indigo-600 flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest transition-colors"><ArrowLeft size={14}/> Back</button>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Forgot Password</h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Enter your email and we'll send you an OTP</p>
              </div>

              <form onSubmit={handleForgotEmail} className="space-y-6 mt-8 flex-1">
                <Input 
                  label="Registered Email" 
                  type="email" 
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)} 
                  required
                  placeholder="name@company.com"
                  icon={Mail}
                />

                {error && (
                  <div className="p-4 bg-red-50/50 rounded-2xl border-2 border-red-100 flex items-center gap-3 animate-in shake duration-300">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <p className="text-red-600 text-[11px] font-bold tracking-widest uppercase leading-none">
                      {error}
                    </p>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="w-full h-14 bg-indigo-600 text-white text-base font-bold tracking-tight rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </form>
            </>
          ) : forgotStep === 'otp' ? (
            <>
              <div className="mb-0">
                 <button onClick={() => setForgotStep('email')} className="mb-4 text-gray-400 hover:text-indigo-600 flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest transition-colors"><ArrowLeft size={14}/> Change Email</button>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Enter OTP</h2>
                <p className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-tighter">Code sent to: {forgotEmail}</p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6 mt-8 flex-1">
                <Input 
                  label="6-Digit Code" 
                  type="text" 
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value)} 
                  required
                  placeholder="000000"
                  icon={Key}
                />

                {error && (
                  <div className="p-4 bg-red-50/50 rounded-2xl border-2 border-red-100 flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <p className="text-red-600 text-[11px] font-bold tracking-widest uppercase">{error}</p>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="w-full h-14 bg-indigo-600 text-white text-base font-bold tracking-tight rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </form>
            </>
          ) : forgotStep === 'reset' ? (
            <>
              <div className="mb-0">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">New Password</h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Identity verified. Choose a secure password</p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-5 mt-8 flex-1">
                <Input 
                  label="New Password" 
                  type="password" 
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)} 
                  required
                  placeholder="••••••••"
                  icon={ShieldCheck}
                />
                <Input 
                  label="Confirm Password" 
                  type="password" 
                  value={confirmPass}
                  onChange={e => setConfirmPass(e.target.value)} 
                  required
                  placeholder="••••••••"
                  icon={ShieldCheck}
                />

                {error && (
                  <div className="p-4 bg-red-50/50 rounded-2xl border-2 border-red-100 flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <p className="text-red-600 text-[11px] font-bold tracking-widest uppercase">{error}</p>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="w-full h-14 bg-indigo-600 text-white text-base font-bold tracking-tight rounded-2xl hover:bg-indigo-700 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Reset Password'}
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle size={48} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Success!</h2>
              <p className="text-sm font-medium text-gray-500 mt-2 px-4">{successMsg}</p>
              
              <button 
                onClick={() => setForgotStep(null)}
                className="mt-10 w-full h-14 bg-gray-900 text-white text-base font-bold tracking-tight rounded-2xl hover:bg-black transition-all active:scale-95"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
