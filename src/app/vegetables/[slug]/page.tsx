'use client';

import React, { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { Star, Heart, ShoppingCart, Check, Minus, Plus, Clock, Shield, ChevronLeft, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { vegetables, PREPARATION_LABELS, PreparationType, getAvailablePreparations, getAvailableWeights, PRODUCT_IMAGES } from '@/lib/data';
import { useCartStore, useWishlistStore } from '@/lib/store';
import { formatPrice, formatWeight, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function VegetableDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const product = vegetables.find(v => v.slug === slug);

    if (!product) return notFound();

    const availablePreps = getAvailablePreparations(product);
    const [selectedPrep, setSelectedPrep] = useState<PreparationType>(availablePreps[0]);
    const availableWeights = getAvailableWeights(product, selectedPrep);
    const [selectedWeight, setSelectedWeight] = useState(availableWeights[0] ?? 500);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    const addItem = useCartStore(s => s.addItem);
    const { toggle, isWishlisted } = useWishlistStore();
    const wishlisted = isWishlisted(product.id);

    const currentVariant = product.variants.find(
        v => v.preparationType === selectedPrep && v.weight === selectedWeight
    );

    const handlePrepChange = (prep: PreparationType) => {
        setSelectedPrep(prep);
        const weights = getAvailableWeights(product, prep);
        if (!weights.includes(selectedWeight)) setSelectedWeight(weights[0] ?? 500);
    };

    const handleAddToCart = () => {
        if (!currentVariant) return;
        addItem(product, currentVariant, quantity);
        setAdded(true);
        toast.success(`${product.name} added to cart!`, { icon: '🛒' });
        setTimeout(() => setAdded(false), 2500);
    };

    const relatedProducts = vegetables.filter(v => v.id !== product.id && v.subcategory === product.subcategory).slice(0, 4);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                    <Link href="/" className="hover:text-green-600">Home</Link>
                    <ChevronLeft className="w-3 h-3 rotate-180" />
                    <Link href="/vegetables" className="hover:text-green-600">Vegetables</Link>
                    <ChevronLeft className="w-3 h-3 rotate-180" />
                    <span className="text-gray-700">{product.name}</span>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* Left — Image */}
                    <div>
                        <div className="bg-white rounded-3xl aspect-square flex items-center justify-center relative overflow-hidden mb-4 shadow-sm border border-gray-100 group">
                            {PRODUCT_IMAGES[product.id] ? (
                                <img src={PRODUCT_IMAGES[product.id]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <span className="text-[140px] group-hover:scale-110 transition-transform">{product.emoji}</span>
                            )}

                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {product.isSeasonal && (
                                    <span className="bg-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full">🌿 Seasonal</span>
                                )}
                                {product.tags.includes('popular') && (
                                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">⭐ Popular</span>
                                )}
                            </div>

                            <button
                                onClick={() => { toggle(product.id); toast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist', { icon: wishlisted ? '💔' : '❤️' }); }}
                                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100 hover:scale-110 transition-transform"
                            >
                                <Heart className={cn('w-5 h-5', wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400')} />
                            </button>
                        </div>

                        {/* Freshness info */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { icon: '🌱', label: 'Farm Fresh' },
                                { icon: '💧', label: 'Washed' },
                                { icon: '⏱️', label: product.shelfLife ?? '3-5 days' },
                            ].map((item, i) => (
                                <div key={i} className="bg-white rounded-xl p-3 text-center border border-gray-100">
                                    <div className="text-lg mb-1">{item.icon}</div>
                                    <div className="text-xs text-gray-600 font-medium">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — Details */}
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            {product.name}
                        </h1>

                        {/* Rating */}
                        {product.rating && (
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className={cn('w-4 h-4', i < Math.floor(product.rating!) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200')} />
                                    ))}
                                </div>
                                <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
                                <span className="text-sm text-gray-400">({product.reviewCount} reviews)</span>
                            </div>
                        )}

                        <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

                        {/* Preparation selector */}
                        <div className="mb-5">
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Choose Preparation
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {availablePreps.map(prep => (
                                    <button
                                        key={prep}
                                        onClick={() => handlePrepChange(prep)}
                                        className={cn(
                                            'px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all',
                                            selectedPrep === prep
                                                ? 'bg-green-500 text-white border-green-500 shadow-sm'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
                                        )}
                                    >
                                        {PREPARATION_LABELS[prep]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Weight selector */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Choose Quantity
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {availableWeights.map(w => (
                                    <button
                                        key={w}
                                        onClick={() => setSelectedWeight(w)}
                                        className={cn(
                                            'px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all',
                                            selectedWeight === w
                                                ? 'bg-gray-900 text-white border-gray-900'
                                                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                                        )}
                                    >
                                        {formatWeight(w)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price display */}
                        <div className="bg-green-50 rounded-2xl p-4 mb-6 border border-green-100">
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-black text-gray-900">
                                    {currentVariant ? formatPrice(currentVariant.price) : '--'}
                                </span>
                                <span className="text-gray-500 text-sm mb-1">
                                    for {formatWeight(selectedWeight)} · {PREPARATION_LABELS[selectedPrep]}
                                </span>
                            </div>
                            {currentVariant?.preparationTime && (
                                <div className="flex items-center gap-1 mt-1 text-xs text-green-700">
                                    <Clock className="w-3 h-3" />
                                    Preparation time: ~{currentVariant.preparationTime} minutes
                                </div>
                            )}
                        </div>

                        {/* Quantity selector */}
                        <div className="flex items-center gap-4 mb-6">
                            <label className="text-sm font-bold text-gray-900">Quantity:</label>
                            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors">
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-10 text-center font-bold text-gray-900">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Add to cart */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleAddToCart}
                                disabled={!currentVariant?.isAvailable}
                                className={cn(
                                    'flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all',
                                    added
                                        ? 'bg-green-100 text-green-700 border-2 border-green-300'
                                        : currentVariant?.isAvailable
                                            ? 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                )}
                            >
                                {added ? <><Check className="w-4 h-4" /> Added to Cart</> : <><ShoppingCart className="w-4 h-4" /> Add to Cart</>}
                            </button>
                            <Link
                                href="/cart"
                                className="px-6 py-3.5 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-bold text-sm flex items-center gap-2 transition-colors"
                            >
                                Buy Now <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Trust */}
                        <div className="flex flex-wrap gap-4 mt-5 pt-5 border-t border-gray-100">
                            {[
                                { icon: Shield, label: 'Food-grade packaging' },
                                { icon: Check, label: 'Freshly prepared' },
                                { icon: Clock, label: 'Fast delivery' },
                            ].map((item, i) => {
                                const Icon = item.icon;
                                return (
                                    <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <Icon className="w-3.5 h-3.5 text-green-500" />
                                        {item.label}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Related products */}
                {relatedProducts.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-5">You may also like</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </section>
                )}
            </div>

            <Footer />
        </div>
    );
}
