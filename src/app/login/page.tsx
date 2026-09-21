'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Leaf, Phone, Mail, Lock, CheckCircle2, Truck, Heart, ArrowRight, ShieldCheck, Clock, User } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
    });

    const login = useAuthStore(s => s.login);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    // Send correct identifier based on method
                    email: loginMethod === 'email' ? form.email : undefined,
                    phone: loginMethod === 'phone' ? form.phone : undefined
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Authentication failed');

            login(data.user);
            toast.success(mode === 'register' ? 'Welcome to Sabjiwala! 🌿' : 'Welcome back!', {
                icon: '✅',
            });
            router.push('/');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f3f9f3] flex flex-col justify-center items-center py-12 px-4 sm:px-6 relative">
            {/* Subtle floating leaves background decoration */}
            <div className="absolute top-10 left-10 text-green-200/40 transform -rotate-45 scale-150 pointer-events-none hidden md:block"><Leaf className="w-24 h-24" /></div>
            <div className="absolute bottom-10 right-20 text-green-200/40 transform rotate-12 scale-150 pointer-events-none hidden md:block"><Leaf className="w-32 h-32" /></div>

            {/* Main Application Container */}
            <div className="w-full max-w-[1000px] bg-white rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden relative z-10 border border-green-50">

                {/* Left Side: Brand Promo (Hidden on Mobile) */}
                <div className="hidden md:flex md:w-[48%] bg-gradient-to-br from-green-50 to-emerald-50/60 p-10 flex-col">

                    <div className="flex-grow flex flex-col">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 w-fit mb-2">
                            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-md">
                                <Leaf className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-black text-2xl text-gray-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                                Fresh<span className="text-green-600">Cut</span>
                            </span>
                        </Link>

                        <div className="text-xs font-bold text-gray-400 tracking-[0.15em] uppercase mb-8">
                            Fresh Vegetables • Healthy Life
                        </div>

                        <h1 className="text-[40px] lg:text-5xl font-black text-green-900 leading-[1.1] mb-5 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            Fresh Ingredients<br />
                            For a Healthier You
                        </h1>

                        <p className="text-gray-600 text-[17px] font-medium leading-relaxed max-w-[380px] mb-8">
                            Farm-fresh vegetables, cut & ready. Delivered to your doorstep.
                        </p>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="flex flex-col items-start gap-2">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-green-600 border border-green-100">
                                    <Leaf className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold text-gray-700 leading-tight">100%<br />Fresh & Clean</span>
                            </div>
                            <div className="flex flex-col items-start gap-2">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-green-600 border border-green-100">
                                    <Truck className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold text-gray-700 leading-tight">Fast<br />Delivery</span>
                            </div>
                            <div className="flex flex-col items-start gap-2">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-green-600 border border-green-100">
                                    <Heart className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold text-gray-700 leading-tight">Healthy<br />Living</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <span className="text-[28px] text-green-600" style={{ fontFamily: 'cursive' }}>
                                Good Food<br />Brighter Days
                            </span>
                        </div>
                    </div>

                    {/* Fresh Veg Image Space / Background Graphic safely contained at the bottom */}
                    <div className="mt-auto flex items-end justify-center overflow-visible">
                        {/* Emojis representing the basket of vegetables until real assets substitute */}
                        <div className="text-7xl lg:text-[100px] select-none mx-auto opacity-95 flex flex-nowrap gap-1">🧺🥦🍅🥕</div>
                    </div>
                </div>

                {/* Right Side: Authentication Form */}
                <div className="w-full md:w-[52%] bg-white p-6 sm:p-10 lg:p-12 flex flex-col justify-center">

                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="text-green-500 mb-3 hidden md:block">
                            <Leaf className="w-8 h-8" />
                        </div>
                        <h2 className="text-[28px] md:text-[32px] font-black text-gray-900 mb-2 leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            {mode === 'login' ? 'Welcome back!' : 'Create Account'}
                        </h2>
                        <p className="text-gray-500 text-sm font-medium">
                            {mode === 'login'
                                ? 'Sign in to continue ordering fresh vegetables.'
                                : 'Sign up to get fresh cuts delivered to you.'}
                        </p>
                    </div>

                    {/* Top Mode Tabs */}
                    <div className="flex bg-gray-50 rounded-full p-1 mb-6 border border-gray-200">
                        <button
                            type="button"
                            onClick={() => setMode('login')}
                            className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-colors ${mode === 'login' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                        >
                            Log In
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('register')}
                            className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-colors ${mode === 'register' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Method Selector (Email / Phone) */}
                    <div className="flex bg-gray-50 rounded-full p-1 mb-6 border border-gray-200">
                        <button
                            type="button"
                            onClick={() => setLoginMethod('email')}
                            className={`flex-1 py-2 rounded-full text-[13px] font-semibold transition-colors flex items-center justify-center gap-1.5 ${loginMethod === 'email' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Mail className="w-4 h-4" /> Email
                        </button>
                        <button
                            type="button"
                            onClick={() => setLoginMethod('phone')}
                            className={`flex-1 py-2 rounded-full text-[13px] font-semibold transition-colors flex items-center justify-center gap-1.5 ${loginMethod === 'phone' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Phone className="w-4 h-4" /> Phone
                        </button>
                    </div>

                    {/* The Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'register' && (
                            <div className="flex items-center bg-white border border-gray-300 rounded-xl focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 overflow-hidden h-[50px] transition-all">
                                <div className="pl-4 pr-3 text-gray-400">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    required
                                    type="text"
                                    placeholder="Enter your full name"
                                    className="flex-1 h-full bg-transparent text-sm font-medium focus:outline-none placeholder:text-gray-400"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                        )}

                        {loginMethod === 'email' ? (
                            <div className="flex items-center bg-white border border-gray-300 rounded-xl focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 overflow-hidden h-[50px] transition-all">
                                <div className="pl-4 pr-3 text-gray-400">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    required
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="flex-1 h-full bg-transparent text-sm font-medium focus:outline-none placeholder:text-gray-400"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center bg-white border border-gray-300 rounded-xl focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 overflow-hidden h-[50px] transition-all">
                                <div className="pl-4 pr-3 text-gray-400">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <input
                                    required
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    className="flex-1 h-full bg-transparent text-sm font-medium focus:outline-none placeholder:text-gray-400"
                                    value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                />
                            </div>
                        )}

                        <div className="flex items-center bg-white border border-gray-300 rounded-xl focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 overflow-hidden h-[50px] transition-all">
                            <div className="pl-4 pr-3 text-gray-400">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                required
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                className="flex-1 h-full bg-transparent text-sm font-medium focus:outline-none placeholder:text-gray-400"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                            />
                            <button
                                type="button"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                onClick={() => setShowPassword(!showPassword)}
                                className="pr-4 pl-2 h-full flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {mode === 'login' && (
                            <div className="flex justify-end pt-1">
                                <Link href="#" className="text-sm font-semibold text-green-600 hover:text-green-700 hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-[50px] rounded-xl transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                        >
                            {isLoading ? (
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    {mode === 'login' ? 'Log In' : 'Create Account'}
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 relative flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                        <div className="relative bg-white px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">or continue with</div>
                    </div>

                    <button
                        type="button"
                        className="mt-6 w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold h-[50px] rounded-xl transition-all outline-none focus:ring-2 focus:ring-gray-200"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </button>

                    {/* Developer shortcut gracefully styled and conditional */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mt-3 text-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setForm({ ...form, phone: '0000000000', password: 'admin' });
                                    setLoginMethod('phone');
                                }}
                                className="text-xs text-gray-400 hover:text-green-600 transition-colors"
                            >
                                Demo: Fill Admin Login
                            </button>
                        </div>
                    )}

                    <p className="mt-6 text-center text-xs text-gray-500">
                        By continuing, you agree to our <Link href="#" className="font-semibold text-green-600 hover:underline">Terms</Link> and <Link href="#" className="font-semibold text-green-600 hover:underline">Privacy Policy</Link>
                    </p>

                    {/* Bottom Feature Tags (Mobile Only since Desktop has them on the left) */}
                    <div className="md:hidden mt-8 pt-6 border-t border-gray-100 grid grid-cols-3 gap-2 px-2">
                        <div className="flex flex-col items-center text-center gap-1.5">
                            <Leaf className="w-5 h-5 text-green-600" />
                            <span className="text-[10px] font-bold text-gray-500">FRESH<br />PRODUCE</span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-1.5">
                            <ShieldCheck className="w-5 h-5 text-green-600" />
                            <span className="text-[10px] font-bold text-gray-500">SAFE &<br />HYGIENIC</span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-1.5">
                            <Clock className="w-5 h-5 text-green-600" />
                            <span className="text-[10px] font-bold text-gray-500">FAST<br />DELIVERY</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
