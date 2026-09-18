'use client';

import React from 'react';
import Link from 'next/link';
import { Package, ChevronRight, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/lib/store';
import { formatDate, formatPrice, ORDER_STATUS_CONFIG } from '@/lib/utils';
import { cn } from '@/lib/utils';

// Demo orders for logged in user
const DEMO_ORDERS = [
    {
        id: 'FC7A2B9',
        date: new Date(Date.now() - 1000 * 60 * 30),
        status: 'OUT_FOR_DELIVERY' as const,
        items: [
            { name: 'Potato', prep: 'Diced', weight: 500, quantity: 1, price: 58 },
            { name: 'Onion', prep: 'Sliced', weight: 500, quantity: 1, price: 52 },
        ],
        total: 140,
        address: 'Koramangala, Bangalore',
    },
    {
        id: 'FC8C3D1',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24),
        status: 'DELIVERED' as const,
        items: [
            { name: 'Aloo Gobi Kit', prep: 'Mixed', weight: 900, quantity: 1, price: 149 },
        ],
        total: 179,
        address: 'Indiranagar, Bangalore',
    },
    {
        id: 'FCBC6H4',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        status: 'DELIVERED' as const,
        items: [
            { name: 'Watermelon', prep: 'Cubed', weight: 500, quantity: 1, price: 55 },
            { name: 'Apple', prep: 'Whole', weight: 500, quantity: 1, price: 115 },
        ],
        total: 200,
        address: 'HSR Layout, Bangalore',
    },
];

export default function OrdersPage() {
    const { user, isLoggedIn } = useAuthStore();

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                    <div className="text-7xl mb-6">📦</div>
                    <h2 className="text-2xl font-black text-gray-900 mb-3">Please log in to view orders</h2>
                    <p className="text-gray-500 mb-8">Sign in or create an account to track your Sabjiwala orders.</p>
                    <Link href="/login" className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-2xl font-bold transition-colors">
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

            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
                <h1 className="text-2xl font-black text-gray-900 mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    📦 My Orders
                </h1>

                {DEMO_ORDERS.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-7xl mb-4">📭</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                        <p className="text-gray-500 mb-6">Your orders will show up here once you place one.</p>
                        <Link href="/vegetables" className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl font-semibold">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {DEMO_ORDERS.map(order => {
                            const statusConfig = ORDER_STATUS_CONFIG[order.status];
                            return (
                                <Link key={order.id} href={`/orders/${order.id}`}>
                                    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-green-200 hover:shadow-md transition-all">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <div className="font-mono font-bold text-gray-900">#{order.id}</div>
                                                <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                    <Clock className="w-3 h-3" />
                                                    {formatDate(order.date)}
                                                </div>
                                            </div>
                                            <span className={cn('text-xs font-bold px-3 py-1 rounded-full', statusConfig.color)}>
                                                {statusConfig.icon} {statusConfig.label}
                                            </span>
                                        </div>

                                        <div className="text-sm text-gray-600 mb-3">
                                            {order.items.map((item, i) => (
                                                <span key={i}>
                                                    {item.name} ({item.prep})
                                                    {i < order.items.length - 1 ? ', ' : ''}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-bold text-gray-900">{formatPrice(order.total)}</div>
                                                <div className="text-xs text-gray-400">{order.address}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {order.status === 'DELIVERED' && (
                                                    <button className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-xl font-semibold hover:bg-green-100 transition-colors">
                                                        Reorder
                                                    </button>
                                                )}
                                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                                    Track <ChevronRight className="w-3.5 h-3.5" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
