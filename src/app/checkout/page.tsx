'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Plus, Clock, CreditCard, Smartphone, Banknote, ChevronLeft, Check, ArrowRight, Lock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useCartStore, useAuthStore } from '@/lib/store';
import { formatPrice, formatWeight, generateOrderId } from '@/lib/utils';
import { PREPARATION_LABELS } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const DELIVERY_SLOTS = [
    'ASAP (30–45 mins)',
    'Today 6:00–7:00 PM',
    'Today 7:00–8:00 PM',
    'Today 8:00–9:00 PM',
    'Tomorrow 9:00–10:00 AM',
    'Tomorrow 11:00 AM–12:00 PM',
];

const PAYMENT_METHODS = [
    { id: 'upi', label: 'UPI', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm' },
    { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, desc: 'Visa, MasterCard, RuPay' },
    { id: 'cod', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when delivered' },
];

export default function CheckoutPage() {
    const { items, couponDiscount, couponCode, deliveryFee, getSubtotal, clearCart } = useCartStore();
    const { isLoggedIn, user } = useAuthStore();
    const router = useRouter();

    const [activeSection, setActiveSection] = useState<'address' | 'slot' | 'payment'>('address');
    const [selectedSlot, setSelectedSlot] = useState('ASAP (30–45 mins)');
    const [selectedPayment, setSelectedPayment] = useState('upi');
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const [address, setAddress] = useState({
        name: user?.name ?? '',
        phone: user?.phone ?? '',
        flat: '',
        street: '',
        area: '',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '',
    });

    const [serverSummary, setServerSummary] = useState<any>(null);
    const [isLoadingSummary, setIsLoadingSummary] = useState(true);

    React.useEffect(() => {
        if (items.length === 0) return;
        const fetchPreview = async () => {
            setIsLoadingSummary(true);
            try {
                const res = await fetch('/api/checkout/preview', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        items: items.map(i => ({ variantId: i.variantId, quantity: i.quantity })),
                        couponCode: couponCode || null,
                        pincode: address.pincode || null
                    })
                });
                const data = await res.json();
                if (res.ok) {
                    setServerSummary(data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoadingSummary(false);
            }
        };
        fetchPreview();
    }, [items, couponCode, address.pincode]);

    const subtotal = serverSummary ? serverSummary.subtotal : getSubtotal();
    const effectiveDelivery = serverSummary ? serverSummary.deliveryFee : (subtotal >= 299 ? 0 : deliveryFee);
    const total = serverSummary ? serverSummary.total : (subtotal - couponDiscount + effectiveDelivery);
    const actualCouponDiscount = serverSummary ? serverSummary.couponDiscount : couponDiscount;

    const handlePlaceOrder = async () => {
        if (!address.flat || !address.street || !address.pincode) {
            toast.error('Please fill in all address fields');
            setActiveSection('address');
            return;
        }
        setIsPlacingOrder(true);
        try {
            const res = await fetch('/api/checkout/place', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: items.map(i => ({ variantId: i.variantId, quantity: i.quantity })),
                    couponCode: couponCode || null,
                    address,
                    paymentMethod: selectedPayment,
                    deliverySlot: selectedSlot,
                    specialInstructions
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to place order');

            clearCart();
            router.push('/order-confirmed');
        } catch (error: any) {
            toast.error(error.message);
            // Re-fetch preview just in case it was a price change or out of stock
            const previewRes = await fetch('/api/checkout/preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: items.map(i => ({ variantId: i.variantId, quantity: i.quantity })),
                    couponCode: couponCode || null,
                    pincode: address.pincode || null
                })
            });
            if (previewRes.ok) {
                setServerSummary(await previewRes.json());
            }
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-md mx-auto px-4 py-20 text-center">
                    <div className="text-7xl mb-4">🛒</div>
                    <h2 className="text-2xl font-black text-gray-900 mb-3">Cart is empty</h2>
                    <Link href="/vegetables" className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl font-bold inline-block">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-xl"><ChevronLeft className="w-5 h-5" /></Link>
                    <h1 className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Checkout</h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">

                        {/* Address Section */}
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            <button
                                onClick={() => setActiveSection(activeSection === 'address' ? 'slot' : 'address')}
                                className="w-full flex items-center justify-between p-5 text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">1</div>
                                    <span className="font-bold text-gray-900">Delivery Address</span>
                                </div>
                                {activeSection !== 'address' && address.flat && (
                                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <Check className="w-3 h-3" /> Added
                                    </span>
                                )}
                            </button>

                            {activeSection === 'address' && (
                                <div className="px-5 pb-5 space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <input placeholder="Full Name" value={address.name} onChange={e => setAddress(a => ({ ...a, name: e.target.value }))}
                                            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400" />
                                        <input placeholder="Phone Number" value={address.phone} onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))}
                                            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400" />
                                    </div>
                                    <input placeholder="Flat / House No. / Building" value={address.flat} onChange={e => setAddress(a => ({ ...a, flat: e.target.value }))}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400" />
                                    <input placeholder="Street / Road" value={address.street} onChange={e => setAddress(a => ({ ...a, street: e.target.value }))}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input placeholder="Area / Locality" value={address.area} onChange={e => setAddress(a => ({ ...a, area: e.target.value }))}
                                            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400" />
                                        <input placeholder="Pincode" value={address.pincode} onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))} maxLength={6}
                                            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input placeholder="City" value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))}
                                            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400" />
                                        <input placeholder="State" value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))}
                                            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400" />
                                    </div>
                                    <textarea
                                        placeholder="Special instructions (optional): e.g. Don't add coriander, call on delivery"
                                        value={specialInstructions}
                                        onChange={e => setSpecialInstructions(e.target.value)}
                                        rows={2}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 resize-none"
                                    />
                                    <button
                                        onClick={() => setActiveSection('slot')}
                                        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold text-sm transition-colors"
                                    >
                                        Continue to Delivery Slot
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Delivery Slot */}
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            <button
                                onClick={() => setActiveSection('slot')}
                                className="w-full flex items-center justify-between p-5 text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold', activeSection === 'slot' ? 'bg-green-500' : 'bg-gray-300')}>2</div>
                                    <span className="font-bold text-gray-900">Delivery Slot</span>
                                </div>
                                {selectedSlot && activeSection !== 'slot' && (
                                    <span className="text-xs text-green-600 font-medium">{selectedSlot}</span>
                                )}
                            </button>
                            {activeSection === 'slot' && (
                                <div className="px-5 pb-5">
                                    <div className="space-y-2">
                                        {DELIVERY_SLOTS.map(slot => (
                                            <button
                                                key={slot}
                                                onClick={() => setSelectedSlot(slot)}
                                                className={cn(
                                                    'w-full flex items-center justify-between p-3 rounded-xl border-2 text-sm transition-all text-left',
                                                    selectedSlot === slot
                                                        ? 'border-green-500 bg-green-50 text-green-700'
                                                        : 'border-gray-100 hover:border-gray-300 text-gray-700'
                                                )}
                                            >
                                                <span className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4" /> {slot}
                                                </span>
                                                {selectedSlot === slot && <Check className="w-4 h-4 text-green-600" />}
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={() => setActiveSection('payment')} className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold text-sm transition-colors">
                                        Continue to Payment
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Payment */}
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            <button
                                onClick={() => setActiveSection('payment')}
                                className="w-full flex items-center gap-3 p-5 text-left"
                            >
                                <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold', activeSection === 'payment' ? 'bg-green-500' : 'bg-gray-300')}>3</div>
                                <span className="font-bold text-gray-900">Payment Method</span>
                            </button>
                            {activeSection === 'payment' && (
                                <div className="px-5 pb-5 space-y-3">
                                    {PAYMENT_METHODS.map(method => {
                                        const Icon = method.icon;
                                        return (
                                            <button
                                                key={method.id}
                                                onClick={() => setSelectedPayment(method.id)}
                                                className={cn(
                                                    'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left',
                                                    selectedPayment === method.id
                                                        ? 'border-green-500 bg-green-50'
                                                        : 'border-gray-100 hover:border-gray-300'
                                                )}
                                            >
                                                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', selectedPayment === method.id ? 'bg-green-100' : 'bg-gray-100')}>
                                                    <Icon className={cn('w-5 h-5', selectedPayment === method.id ? 'text-green-600' : 'text-gray-400')} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-900 text-sm">{method.label}</div>
                                                    <div className="text-xs text-gray-400">{method.desc}</div>
                                                </div>
                                                {selectedPayment === method.id && <Check className="w-5 h-5 text-green-500" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 sticky top-32">
                            <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                            <div className="space-y-3 mb-4">
                                {items.map(item => (
                                    <div key={item.id} className="flex gap-3">
                                        <span className="text-xl flex-shrink-0">{item.productEmoji}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-medium text-gray-900 truncate">{item.productName}</div>
                                            <div className="text-[10px] text-gray-400">
                                                {PREPARATION_LABELS[item.preparationType]} · {formatWeight(item.weight)} × {item.quantity}
                                            </div>
                                        </div>
                                        <div className="text-xs font-bold text-gray-900 flex-shrink-0">{formatPrice(item.price * item.quantity)}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                                <div className="flex justify-between"><span className="text-gray-600">Delivery</span><span className={effectiveDelivery === 0 ? 'text-green-600' : ''}>{effectiveDelivery === 0 ? 'FREE' : formatPrice(effectiveDelivery)}</span></div>
                                {actualCouponDiscount > 0 && <div className="flex justify-between text-green-600"><span>Coupon ({couponCode})</span><span>-{formatPrice(actualCouponDiscount)}</span></div>}
                                <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-base">
                                    <span>Total</span><span>{formatPrice(total)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isPlacingOrder}
                                className="mt-5 w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white py-3.5 rounded-2xl font-bold text-sm transition-all shadow-md"
                            >
                                {isPlacingOrder ? (
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Lock className="w-4 h-4" />
                                        Place Order · {formatPrice(total)}
                                    </>
                                )}
                            </button>
                            <p className="text-center text-xs text-gray-400 mt-2">🔒 Secure & encrypted payment</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
