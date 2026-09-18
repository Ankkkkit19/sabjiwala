'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle, MapPin, Package, ArrowRight, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function OrderConfirmedPage() {
    const orderId = 'FC' + Math.random().toString(36).substring(2, 8).toUpperCase();

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-lg mx-auto px-4 py-12 text-center">

                {/* Success animation */}
                <div className="relative w-28 h-28 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-pulse-green">
                        <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <div className="absolute -top-1 -right-1 text-2xl animate-bounce-subtle">🎉</div>
                </div>

                <h1 className="text-3xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Order Confirmed!
                </h1>
                <p className="text-gray-500 mb-8">
                    Your fresh ingredients are being prepared with care.
                </p>

                {/* Order ID */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                    <p className="text-xs text-gray-400 mb-1">Order ID</p>
                    <p className="font-mono font-black text-2xl text-gray-900 mb-3">#{orderId}</p>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-left">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">✓</span>
                            </div>
                            <span className="text-sm font-semibold text-green-800">Estimated Delivery</span>
                        </div>
                        <p className="text-2xl font-black text-green-700">30–45 minutes</p>
                        <p className="text-xs text-green-600 mt-0.5">Your vegetables are being freshly prepared</p>
                    </div>
                </div>

                {/* Timeline preview */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 text-left">
                    <h3 className="font-semibold text-gray-900 text-sm mb-4">Order Status</h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Order Confirmed', done: true, active: false },
                            { label: 'Being Prepared', done: false, active: true },
                            { label: 'Packed', done: false, active: false },
                            { label: 'Out for Delivery', done: false, active: false },
                            { label: 'Delivered', done: false, active: false },
                        ].map((step, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${step.done ? 'bg-green-500 text-white' :
                                        step.active ? 'bg-green-100 border-2 border-green-400 text-green-600' :
                                            'bg-gray-100 text-gray-400'
                                    }`}>
                                    {step.done ? '✓' : i + 1}
                                </div>
                                <span className={`text-sm ${step.done || step.active ? 'font-semibold text-gray-900' : 'text-gray-400'}`}>
                                    {step.label}
                                </span>
                                {step.active && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium ml-auto">In Progress</span>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <Link
                        href={`/orders/${orderId}`}
                        className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-2xl font-bold transition-colors shadow-md"
                    >
                        <Package className="w-4 h-4" />
                        Track Order
                    </Link>
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 rounded-2xl font-semibold transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>

                {/* Review prompt */}
                <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-200">
                    <p className="text-sm text-amber-800 font-medium flex items-center justify-center gap-1.5">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        After delivery, please rate your order!
                    </p>
                </div>
            </div>
        </div>
    );
}
