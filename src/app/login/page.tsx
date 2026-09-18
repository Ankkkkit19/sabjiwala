'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Leaf, Phone, Mail, Lock, User, ArrowRight } from 'lucide-react';
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

        // Simulate auth delay
        await new Promise(r => setTimeout(r, 800));

        // Demo login — in production, this calls the API
        login({
            id: 'demo-user-1',
            name: mode === 'register' ? form.name : 'Demo User',
            email: form.email || undefined,
            phone: form.phone || undefined,
            role: 'CUSTOMER',
        });

        toast.success(mode === 'register' ? 'Welcome to Sabjiwala! 🌿' : 'Welcome back!', {
            icon: '✅',
        });

        setIsLoading(false);
        router.push('/');
    };

    const handleAdminLogin = () => {
        login({
            id: 'admin-1',
            name: 'Admin',
            email: 'admin@sabjiwala.in',
            role: 'ADMIN',
        });
        toast.success('Logged in as Admin');
        router.push('/admin');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 justify-center mb-8">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                        <Leaf className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-black text-2xl text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        Fresh<span className="text-green-500">Cut</span>
                    </span>
                </Link>

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                    {/* Tabs */}
                    <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
                        <button
                            onClick={() => setMode('login')}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === 'login' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
                                }`}
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => setMode('register')}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === 'register' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                        {mode === 'login' ? 'Welcome back!' : 'Join Sabjiwala'}
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                        {mode === 'login'
                            ? 'Sign in to continue ordering fresh vegetables.'
                            : 'Sign up to start ordering fresh, cut vegetables.'}
                    </p>

                    {/* Login method toggle */}
                    {mode === 'login' && (
                        <div className="flex bg-gray-100 rounded-xl p-1 mb-5 text-sm">
                            <button
                                onClick={() => setLoginMethod('email')}
                                className={`flex-1 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${loginMethod === 'email' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
                                    }`}
                            >
                                <Mail className="w-3.5 h-3.5" /> Email
                            </button>
                            <button
                                onClick={() => setLoginMethod('phone')}
                                className={`flex-1 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${loginMethod === 'phone' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
                                    }`}
                            >
                                <Phone className="w-3.5 h-3.5" /> Phone
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'register' && (
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    required
                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                                />
                            </div>
                        )}

                        {(mode === 'register' || loginMethod === 'email') && (
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={form.email}
                                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                    required={loginMethod === 'email'}
                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                                />
                            </div>
                        )}

                        {(mode === 'register' || loginMethod === 'phone') && (
                            <div className="relative">
                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-gray-600 font-medium">+91</span>
                                <input
                                    type="tel"
                                    placeholder="10-digit mobile number"
                                    value={form.phone}
                                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                    required={loginMethod === 'phone'}
                                    maxLength={10}
                                    className="w-full pl-20 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                                />
                            </div>
                        )}

                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={form.password}
                                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                required
                                className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        {mode === 'login' && (
                            <div className="flex justify-end">
                                <button type="button" className="text-xs text-green-600 hover:text-green-700 font-medium">
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md"
                        >
                            {isLoading ? (
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    {mode === 'login' ? 'Log In' : 'Create Account'}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-gray-100" />
                        <span className="text-xs text-gray-400">or continue with</span>
                        <div className="flex-1 h-px bg-gray-100" />
                    </div>

                    {/* Google */}
                    <button className="w-full flex items-center justify-center gap-3 border border-gray-200 hover:bg-gray-50 py-3 rounded-xl text-sm font-medium text-gray-700 transition-colors">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </button>

                    {/* Admin demo */}
                    <div className="mt-4 text-center">
                        <button
                            onClick={handleAdminLogin}
                            className="text-xs text-gray-400 hover:text-gray-600 underline"
                        >
                            Demo: Login as Admin
                        </button>
                    </div>
                </div>

                <p className="text-center text-xs text-gray-400 mt-4">
                    By continuing, you agree to our{' '}
                    <Link href="/terms" className="text-green-600 hover:underline">Terms</Link> and{' '}
                    <Link href="/privacy" className="text-green-600 hover:underline">Privacy Policy</Link>
                </p>
            </div>
        </div>
    );
}
