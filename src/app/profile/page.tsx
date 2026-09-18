'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/lib/store';
import {
    User, MapPin, Package, Heart, Settings, Bell,
    HelpCircle, LogOut, ChevronRight, Star, CreditCard
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const MENU_SECTIONS = [
    {
        title: 'Shopping',
        items: [
            { href: '/orders', label: 'My Orders', icon: Package, desc: '3 orders placed' },
            { href: '/profile/wishlist', label: 'Wishlist', icon: Heart, desc: '5 saved items' },
            { href: '/profile/addresses', label: 'Saved Addresses', icon: MapPin, desc: '2 addresses' },
            { href: '/cart', label: 'View Cart', icon: Package, desc: 'Continue shopping' },
        ],
    },
    {
        title: 'Account',
        items: [
            { href: '/profile/settings', label: 'Profile Settings', icon: Settings, desc: 'Edit name, email, phone' },
            { href: '/offers', label: 'Coupons & Offers', icon: Star, desc: 'View available discounts' },
            { href: '/profile/notifications', label: 'Notifications', icon: Bell, desc: 'Manage alerts' },
        ],
    },
    {
        title: 'Support',
        items: [
            { href: '/support', label: 'Help & Support', icon: HelpCircle, desc: 'Get assistance' },
        ],
    },
];

export default function ProfilePage() {
    const { user, isLoggedIn, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        router.push('/');
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-md mx-auto px-4 py-20 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">👤</div>
                    <h2 className="text-2xl font-black text-gray-900 mb-3">Please log in</h2>
                    <p className="text-gray-500 mb-8">Sign in to access your profile, orders, and wishlist.</p>
                    <Link href="/login" className="bg-green-500 hover:bg-green-600 text-white px-8 py-3.5 rounded-2xl font-bold transition-colors block">
                        Login / Register
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">

                {/* Profile card */}
                <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-3xl p-6 text-white mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-black">
                            {user?.name?.[0] ?? '👤'}
                        </div>
                        <div>
                            <h2 className="text-xl font-black" style={{ fontFamily: 'Outfit, sans-serif' }}>{user?.name ?? 'Guest'}</h2>
                            {user?.email && <p className="text-green-100 text-sm">{user.email}</p>}
                            {user?.phone && <p className="text-green-100 text-sm">+91 {user.phone}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-5">
                        {[
                            { value: '3', label: 'Orders' },
                            { value: '5', label: 'Wishlist' },
                            { value: '2', label: 'Addresses' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white/15 rounded-xl p-3 text-center">
                                <div className="text-2xl font-black">{stat.value}</div>
                                <div className="text-xs text-green-100">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Menu sections */}
                {MENU_SECTIONS.map(section => (
                    <div key={section.title} className="mb-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
                            {section.title}
                        </h3>
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            {section.items.map((item, i) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${i < section.items.length - 1 ? 'border-b border-gray-50' : ''
                                            }`}
                                    >
                                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Icon className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900 text-sm">{item.label}</div>
                                            <div className="text-xs text-gray-400">{item.desc}</div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Admin link if admin */}
                {user?.role === 'ADMIN' && (
                    <div className="mb-4">
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            <Link href="/admin" className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                                    <Settings className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900 text-sm">Admin Panel</div>
                                    <div className="text-xs text-gray-400">Manage products, orders, users</div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300" />
                            </Link>
                        </div>
                    </div>
                )}

                {/* Logout */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 px-5 py-4 hover:bg-red-50 transition-colors w-full"
                    >
                        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                            <LogOut className="w-5 h-5 text-red-500" />
                        </div>
                        <span className="font-medium text-red-600 text-sm">Log Out</span>
                    </button>
                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                    Sabjiwala v1.0 · Made for fresh food lovers 🌿
                </p>
            </div>
            <Footer />
        </div>
    );
}
