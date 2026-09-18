'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, Tag, ShoppingBag, ArrowRight, ChevronLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCartStore } from '@/lib/store';
import { formatPrice, formatWeight, cn } from '@/lib/utils';
import { PREPARATION_LABELS } from '@/lib/data';
import { coupons } from '@/lib/data';
import toast from 'react-hot-toast';

export default function CartPage() {
    const { items, removeItem, updateQuantity, applyCoupon, removeCoupon, couponCode, couponDiscount, deliveryFee, getSubtotal, getTotal } = useCartStore();
    const [couponInput, setCouponInput] = useState('');
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    const subtotal = getSubtotal();
    const total = getTotal();

    const handleApplyCoupon = () => {
        const coupon = coupons.find(c => c.code === couponInput.toUpperCase().trim() && c.isActive);
        if (!coupon) {
            toast.error('Invalid or expired coupon code');
            return;
        }
        if (subtotal < coupon.minimumOrder) {
            toast.error(`Minimum order ₹${coupon.minimumOrder} required for this coupon`);
            return;
        }
        let discount = 0;
        if (coupon.discountType === 'PERCENTAGE') {
            discount = (subtotal * coupon.discountValue) / 100;
            if (coupon.maximumDiscount) discount = Math.min(discount, coupon.maximumDiscount);
        } else {
            discount = coupon.discountValue;
        }
        applyCoupon(coupon.code, discount);
        toast.success(`Coupon applied! You save ${formatPrice(discount)}`);
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                    <div className="text-8xl mb-6">🛒</div>
                    <h2 className="text-2xl font-black text-gray-900 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        Your cart is empty
                    </h2>
                    <p className="text-gray-500 mb-8">Add fresh vegetables, fruits or recipe kits to get started.</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link href="/vegetables" className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl font-semibold transition-colors">
                            🥕 Shop Vegetables
                        </Link>
                        <Link href="/fruits" className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-3 rounded-2xl font-semibold transition-colors">
                            🍎 Shop Fruits
                        </Link>
                        <Link href="/what-should-i-cook" className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-2xl font-semibold transition-colors">
                            👨‍🍳 What to Cook?
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        🛒 Your Cart
                    </h1>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                        {items.length} item{items.length !== 1 ? 's' : ''}
                    </span>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-3">
                        {items.map(item => (
                            <div key={item.id} className="bg-white rounded-2xl p-4 border border-gray-100 flex gap-4 hover:border-green-100 transition-colors">
                                <div className="w-16 h-16 bg-green-50 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                                    {item.productEmoji}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 text-sm">{item.productName}</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {PREPARATION_LABELS[item.preparationType]} · {formatWeight(item.weight)}
                                    </p>
                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                                            >
                                                {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                                            </button>
                                            <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-green-50 hover:text-green-500 transition-colors"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</div>
                                            {item.quantity > 1 && (
                                                <div className="text-xs text-gray-400">{formatPrice(item.price)} each</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        {/* Coupon */}
                        <div className="bg-white rounded-2xl p-4 border border-gray-100">
                            <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                                <Tag className="w-4 h-4 text-green-500" />
                                Apply Coupon
                            </h3>
                            {couponCode ? (
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
                                    <div>
                                        <span className="font-bold text-green-700 text-sm">{couponCode}</span>
                                        <p className="text-xs text-green-600">You save {formatPrice(couponDiscount)}</p>
                                    </div>
                                    <button onClick={removeCoupon} className="text-xs text-red-500 hover:underline font-medium">Remove</button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponInput}
                                        onChange={e => setCouponInput(e.target.value)}
                                        placeholder="Enter coupon code"
                                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400"
                                        onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                                    />
                                    <button
                                        onClick={handleApplyCoupon}
                                        className="px-4 py-2.5 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                            )}
                            {/* Coupon hints */}
                            <div className="flex flex-wrap gap-2 mt-3">
                                {['FIRSTORDER', 'FRESH20', 'WELCOME10'].map(code => (
                                    <button
                                        key={code}
                                        onClick={() => setCouponInput(code)}
                                        className="text-xs px-2.5 py-1 border border-green-200 text-green-700 rounded-full hover:bg-green-50 transition-colors font-medium"
                                    >
                                        {code}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 sticky top-32">
                            <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Delivery fee</span>
                                    <span className={cn('font-medium', subtotal >= 299 ? 'text-green-600 line-through' : '')}>
                                        {formatPrice(deliveryFee)}
                                    </span>
                                </div>
                                {subtotal >= 299 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Free delivery</span>
                                        <span>-{formatPrice(deliveryFee)}</span>
                                    </div>
                                )}
                                {couponDiscount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Coupon ({couponCode})</span>
                                        <span>-{formatPrice(couponDiscount)}</span>
                                    </div>
                                )}
                                <div className="border-t border-gray-100 pt-3">
                                    <div className="flex justify-between font-bold text-base">
                                        <span>Total</span>
                                        <span>{formatPrice(subtotal >= 299 ? subtotal - couponDiscount : total)}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Inclusive of all taxes</p>
                                </div>
                            </div>

                            {subtotal < 299 && (
                                <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                                    <p className="text-xs text-amber-700">
                                        Add <strong>{formatPrice(299 - subtotal)}</strong> more for free delivery!
                                    </p>
                                </div>
                            )}

                            <Link
                                href="/checkout"
                                className="mt-5 flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-2xl font-bold text-sm transition-all shadow-md hover:shadow-lg"
                            >
                                Proceed to Checkout <ArrowRight className="w-4 h-4" />
                            </Link>

                            <Link
                                href="/vegetables"
                                className="mt-3 flex items-center justify-center gap-2 w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 rounded-2xl font-medium text-sm transition-colors"
                            >
                                <ShoppingBag className="w-4 h-4" /> Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
