'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    LayoutDashboard, Package, ShoppingBag, Users, Truck, Tag,
    BarChart3, Settings, LogOut, ChevronRight, Leaf, Menu, X,
    Star, AlertTriangle, TrendingUp, DollarSign, Clock, Zap
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { vegetables, fruits, recipes } from '@/lib/data';

const STATS = [
    { label: "Today's Orders", value: '47', change: '+12%', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: "Today's Revenue", value: '₹8,240', change: '+8%', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending Orders', value: '12', change: '-3', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Active Deliveries', value: '8', change: '', icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Low Stock Items', value: '3', change: '', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Total Customers', value: '2,341', change: '+45', icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
];

const RECENT_ORDERS = [
    { id: 'FC7A2B9', customer: 'Priya Sharma', items: 'Potato (Diced), Onion (Sliced)', amount: '₹149', status: 'PREPARING', time: '5 min ago' },
    { id: 'FC8C3D1', customer: 'Rahul Verma', items: 'Aloo Gobi Kit (2)', amount: '₹248', status: 'CONFIRMED', time: '12 min ago' },
    { id: 'FC9E4F2', customer: 'Anjali Gupta', items: 'Watermelon (Cubed), Apple', amount: '₹195', status: 'OUT_FOR_DELIVERY', time: '28 min ago' },
    { id: 'FCAB5G3', customer: 'Vikram Singh', items: 'Mix Veg Kit (4)', amount: '₹349', status: 'DELIVERED', time: '1 hr ago' },
    { id: 'FCBC6H4', customer: 'Deepa Reddy', items: 'Spinach, Carrot (Grated)', amount: '₹112', status: 'PENDING', time: '2 min ago' },
];

const NAV_ITEMS = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag, badge: 12 },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/inventory', label: 'Inventory', icon: BarChart3 },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/delivery', label: 'Delivery', icon: Truck },
    { href: '/admin/coupons', label: 'Coupons', icon: Tag },
    { href: '/admin/analytics', label: 'Analytics', icon: TrendingUp },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
];

const STATUS_STYLES: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    PREPARING: 'bg-orange-100 text-orange-700',
    PACKED: 'bg-purple-100 text-purple-700',
    OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
};

export default function AdminDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (e) { }
        logout();
        router.push('/');
    };

    const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
        <aside className={cn(
            'flex flex-col h-full bg-gray-950 text-white',
            mobile ? 'w-full' : 'w-64'
        )}>
            {/* Logo */}
            <div className="p-5 border-b border-gray-800">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <Leaf className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <span className="font-black text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            Fresh<span className="text-green-400">Cut</span>
                        </span>
                        <div className="text-[10px] text-gray-500 font-medium -mt-0.5">ADMIN PANEL</div>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map(item => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <Icon className="w-4 h-4 group-hover:text-green-400 transition-colors" />
                                {item.label}
                            </div>
                            {item.badge ? (
                                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    {item.badge}
                                </span>
                            ) : null}
                        </Link>
                    );
                })}
            </nav>

            {/* User */}
            <div className="p-3 border-t border-gray-800">
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                        {user?.name?.[0] ?? 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">{user?.name ?? 'Admin'}</div>
                        <div className="text-xs text-gray-500 truncate">{user?.email ?? 'admin@sabjiwala.in'}</div>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl text-sm transition-all mt-1"
                >
                    <LogOut className="w-4 h-4" /> Log Out
                </button>
            </div>
        </aside>
    );

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex flex-col h-full flex-shrink-0">
                <Sidebar />
            </div>

            {/* Mobile Sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <div className="relative w-72 h-full">
                        <Sidebar mobile />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Top bar */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-4 sm:px-6 py-3.5 flex items-center justify-between z-10 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-1.5 hover:bg-gray-100 rounded-lg"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h1 className="font-bold text-gray-900">Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs text-gray-500 hidden sm:inline">Live</span>
                        <Link href="/" className="ml-2 text-xs text-green-600 hover:underline">View Store →</Link>
                    </div>
                </div>

                <div className="p-4 sm:p-6 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {STATS.map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', stat.bg)}>
                                            <Icon className={cn('w-5 h-5', stat.color)} />
                                        </div>
                                        {stat.change && (
                                            <span className={cn(
                                                'text-xs font-semibold px-2 py-0.5 rounded-full',
                                                stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            )}>
                                                {stat.change}
                                            </span>
                                        )}
                                    </div>
                                    <div className="font-black text-xl text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                                        {stat.value}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Revenue chart placeholder */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-gray-900">Revenue Overview</h2>
                            <select className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600">
                                <option>Last 7 days</option>
                                <option>Last 30 days</option>
                                <option>Last 3 months</option>
                            </select>
                        </div>
                        <div className="flex items-end gap-2 h-32">
                            {[45, 62, 38, 75, 91, 58, 83].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                    <div
                                        className="w-full bg-green-500 rounded-t-lg hover:bg-green-600 transition-colors cursor-pointer"
                                        style={{ height: `${(h / 100) * 100}%` }}
                                        title={`₹${h * 100}`}
                                    />
                                    <span className="text-[10px] text-gray-400">
                                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                        {/* Recent Orders */}
                        <div className="bg-white rounded-2xl border border-gray-100">
                            <div className="flex items-center justify-between p-5 border-b border-gray-100">
                                <h2 className="font-bold text-gray-900 text-sm">Recent Orders</h2>
                                <Link href="/admin/orders" className="text-xs text-green-600 font-medium hover:underline">
                                    View all →
                                </Link>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {RECENT_ORDERS.map(order => (
                                    <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <div>
                                                <span className="font-mono text-xs font-bold text-gray-700">#{order.id}</span>
                                                <span className="text-xs text-gray-400 ml-2">{order.time}</span>
                                            </div>
                                            <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', STATUS_STYLES[order.status])}>
                                                {order.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 mb-1">{order.customer}</p>
                                        <p className="text-[11px] text-gray-400 truncate mb-1">{order.items}</p>
                                        <p className="text-sm font-bold text-gray-900">{order.amount}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Low Stock + Quick Actions */}
                        <div className="space-y-4">
                            {/* Low Stock Alert */}
                            <div className="bg-white rounded-2xl border border-gray-100">
                                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                    <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-red-500" /> Low Stock Alert
                                    </h2>
                                </div>
                                <div className="p-4 space-y-3">
                                    {[
                                        { name: 'Spinach', stock: '1.2 kg', threshold: '2 kg' },
                                        { name: 'Broccoli', stock: '0.8 kg', threshold: '1 kg' },
                                        { name: 'Pomegranate', stock: '5 units', threshold: '10 units' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                <div className="text-xs text-red-500">Stock: {item.stock}</div>
                                            </div>
                                            <Link
                                                href="/admin/inventory"
                                                className="text-xs bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-lg hover:bg-red-100 transition-colors font-medium"
                                            >
                                                Update
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-4">
                                <h2 className="font-bold text-gray-900 text-sm mb-3">Quick Actions</h2>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { href: '/admin/products/new', label: 'Add Product', icon: Package, color: 'bg-green-50 text-green-700 hover:bg-green-100' },
                                        { href: '/admin/orders', label: 'Manage Orders', icon: ShoppingBag, color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
                                        { href: '/admin/coupons', label: 'Add Coupon', icon: Tag, color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
                                        { href: '/admin/inventory', label: 'Update Stock', icon: BarChart3, color: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
                                    ].map(action => {
                                        const Icon = action.icon;
                                        return (
                                            <Link
                                                key={action.href}
                                                href={action.href}
                                                className={cn('flex flex-col items-center gap-2 p-3 rounded-xl text-xs font-medium transition-colors text-center', action.color)}
                                            >
                                                <Icon className="w-5 h-5" />
                                                {action.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product counts */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: 'Vegetables', count: vegetables.length, emoji: '🥕', href: '/admin/products' },
                            { label: 'Fruits', count: fruits.length, emoji: '🍎', href: '/admin/products' },
                            { label: 'Recipe Kits', count: recipes.length, emoji: '🍛', href: '/admin/products' },
                        ].map(item => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-green-200 hover:shadow-md transition-all text-center"
                            >
                                <div className="text-3xl mb-2">{item.emoji}</div>
                                <div className="font-black text-2xl text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>{item.count}</div>
                                <div className="text-xs text-gray-500">{item.label}</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
