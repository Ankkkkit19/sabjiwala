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
        <div className="min-h-screen bg-[#f3f9f3] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Subtle floating leaves background decoration */}
            <div className="absolute top-10 left-10 text-green-200/50 transform -rotate-45 scale-150"><Leaf className="w-24 h-24" /></div>
            <div className="absolute bottom-10 right-20 text-green-200/50 transform rotate-12 scale-150"><Leaf className="w-32 h-32" /></div>
            <div className="absolute top-40 right-40 text-green-200/50 transform -rotate-12 scale-100"><Leaf className="w-16 h-16" /></div>

            {/* Main Application Container */}
            <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(22,101,52,0.15)] flex flex-col md:flex-row overflow-hidden relative z-10 border border-green-50">

                {/* Left Side: Brand Promo (Hidden on Mobile) */}
                <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-green-50 to-emerald-50/50 p-12 flex-col justify-between relative">

                    <div className="space-y-6 relative z-10">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 w-fit">
                            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
                                <Leaf className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-black text-2xl text-gray-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                                Fresh<span className="text-green-600">Cut</span>
                            </span>
                        </Link>

                        <div className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase mt-2">
                            Fresh Vegetables • Healthy Life
                        </div>

                        <h1 className="text-5xl font-black text-green-900 leading-[1.1] tracking-tight mt-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            Fresh Ingredients<br />
                            For a Healthier You
                        </h1>
                        <p className="text-gray-600 text-lg font-medium max-w-sm leading-relaxed">
                            Farm-fresh vegetables, cut & ready.<br />
                            Delivered to your doorstep.
                        </p>

                        <div className="flex items-center gap-8 pt-6">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-green-600 border border-green-100"><Leaf className="w-6 h-6" /></div>
                                <span className="text-xs font-bold text-gray-700 text-center leading-tight">100%<br />Fresh & Clean</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-green-600 border border-green-100"><Truck className="w-6 h-6" /></div>
                                <span className="text-xs font-bold text-gray-700 text-center leading-tight">Fast<br />Delivery</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-green-600 border border-green-100"><Heart className="w-6 h-6" /></div>
                                <span className="text-xs font-bold text-gray-700 text-center leading-tight">Healthy<br />Living</span>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Typography */}
                    <div className="absolute right-12 bottom-48 z-10 opacity-80 transform -rotate-6">
                        <span className="text-3xl font-medium text-green-600" style={{ fontFamily: 'cursive' }}>
                            Good Food<br />Brighter Days
                        </span>
                    </div>

                    {/* Fresh Veg Image Space / Background Graphic */}
                    <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-green-100/50 to-transparent flex items-end justify-center pointer-events-none">
                        {/* Emojis simulating the basket of vegetables until real assets substitute */}
                        <div className="text-9xl transform translate-y-10">🧺🥦🍅🥕</div>
                    </div>
                </div>

                {/* Right Side: Authentication Form */}
                <div className="w-full md:w-1/2 bg-white p-8 md:p-12 lg:p-16 flex flex-col justify-center">

                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="text-green-500 mb-2">
                            <Leaf className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            {mode === 'login' ? 'Welcome back!' : 'Create Account'}
                        </h2>
                        <p className="text-gray-500 text-sm font-medium">
                            {mode === 'login'
                                ? 'Sign in to continue ordering fresh vegetables.'
                                : 'Sign up to get fresh cuts delivered to you.'}
                        </p>
                    </div>

                    {/* Top Mode Tabs */}
                    <div className="flex bg-gray-50 rounded-2xl p-1 mb-6 border border-gray-100">
                        <button
                            type="button"
                            onClick={() => setMode('login')}
                            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${mode === 'login' ? 'bg-green-600 text-white shadow-md shadow-green-200' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Log In
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('register')}
                            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${mode === 'register' ? 'bg-green-600 text-white shadow-md shadow-green-200' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Method Selector (Email / Phone) */}
                    <div className="flex gap-3 mb-6">
                        <button
                            type="button"
                            onClick={() => setLoginMethod('email')}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border flex items-center justify-center gap-2 ${loginMethod === 'email' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                        >
                            <Mail className="w-4 h-4" /> Email
                        </button>
                        <button
                            type="button"
                            onClick={() => setLoginMethod('phone')}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border flex items-center justify-center gap-2 ${loginMethod === 'phone' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                        >
                            <Phone className="w-4 h-4" /> Phone
                        </button>
                    </div>

                    {/* The Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'register' && (
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    required
                                    type="text"
                                    placeholder="Enter your full name"
                                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all placeholder:text-gray-400"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                        )}

                        {loginMethod === 'email' ? (
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    required
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all placeholder:text-gray-400"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                />
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <input
                                    required
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all placeholder:text-gray-400"
                                    value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                />
                            </div>
                        )}

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                required
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                className="w-full pl-11 pr-12 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all placeholder:text-gray-400"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {mode === 'login' && (
                            <div className="flex justify-end pt-1 pb-2">
                                <Link href="#" className="text-sm font-bold text-green-600 hover:text-green-700 hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_4px_14px_0_rgba(21,128,61,0.39)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                        >
                            {isLoading ? (
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    {mode === 'login' ? 'Log In' : 'Sign Up'}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 relative flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                        <div className="relative bg-white px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">or continue with</div>
                    </div>

                    <button
                        type="button"
                        className="mt-6 w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 font-bold py-3.5 rounded-2xl transition-all"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </button>

                    <p className="mt-8 text-center text-xs text-gray-500">
                        By continuing, you agree to our <Link href="#" className="font-bold text-green-600 hover:underline">Terms</Link> and <Link href="#" className="font-bold text-green-600 hover:underline">Privacy Policy</Link>
                    </p>

                    {/* Bottom Feature Tags (matches design) */}
                    <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between px-4">
                        <div className="flex flex-col items-center gap-1.5">
                            <Leaf className="w-4 h-4 text-green-600" />
                            <span className="text-[10px] font-bold text-gray-500 uppercase">Fresh Produce</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-green-600" />
                            <span className="text-[10px] font-bold text-gray-500 uppercase">Safe & Hygienic</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5">
                            <Clock className="w-4 h-4 text-green-600" />
                            <span className="text-[10px] font-bold text-gray-500 uppercase">On-Time Delivery</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
