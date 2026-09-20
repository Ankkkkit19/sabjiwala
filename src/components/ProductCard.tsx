'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Minus } from 'lucide-react';
import { Product, getAvailablePreparations, getAvailableWeights, PREPARATION_LABELS, PRODUCT_IMAGES } from '@/lib/data';
import { useCartStore } from '@/lib/store';
import { formatPrice, formatWeight, cn } from '@/lib/utils';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const defaultPrep = getAvailablePreparations(product)[0];
    const defaultWeight = getAvailableWeights(product, defaultPrep)[0] ?? 500;

    const { items, addItem, removeItem, updateQuantity } = useCartStore();

    const currentVariant = product.variants.find(
        v => v.preparationType === defaultPrep && v.weight === defaultWeight
    );

    // CartItem has: id, productId, preparationType, weight — no nested variant object
    const cartItem = items.find(
        i => i.productId === product.id &&
            i.preparationType === defaultPrep &&
            i.weight === defaultWeight
    );

    const quantity = cartItem ? cartItem.quantity : 0;

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!currentVariant) return;
        addItem(product, currentVariant);
    };

    const handleIncrement = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!cartItem) return;
        updateQuantity(cartItem.id, quantity + 1);
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!cartItem) return;
        if (quantity === 1) {
            removeItem(cartItem.id);
        } else {
            updateQuantity(cartItem.id, quantity - 1);
        }
    };

    // Show MRP with 20% markup for strikethrough
    const originalPrice = currentVariant
        ? Math.round(currentVariant.price * 1.2)
        : Math.round(product.basePrice * 1.2);

    return (
        <Link href={`/${product.category === 'VEGETABLES' ? 'vegetables' : 'fruits'}/${product.slug}`}>
            <div className="bg-white hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden flex flex-col h-full border border-gray-100 relative group">

                {/* Image Container */}
                <div className="relative aspect-square bg-[#f8f9fa] flex items-center justify-center overflow-hidden">
                    {PRODUCT_IMAGES[product.id] ? (
                        <img
                            src={PRODUCT_IMAGES[product.id]}
                            alt={product.name}
                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                        />
                    ) : (
                        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                            {product.emoji ?? '🥦'}
                        </span>
                    )}

                    {/* Badges */}
                    <div className="absolute top-2 left-2">
                        {product.tags?.includes('popular') ? (
                            <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-sm">
                                POPULAR
                            </span>
                        ) : (
                            <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-sm">
                                FRESH
                            </span>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-3.5 flex flex-col flex-1">
                    <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">
                        {product.emoji} {product.name}
                    </h3>

                    <div className="text-xs text-green-700 font-medium mb-0.5 bg-green-50 w-fit px-1.5 py-0.5 rounded">
                        {PREPARATION_LABELS[defaultPrep]}
                    </div>

                    <div className="text-xs text-gray-500 mb-3">
                        {formatWeight(defaultWeight)}
                    </div>

                    {/* Price & Add Button */}
                    <div className="flex items-end justify-between mt-auto">
                        <div>
                            <div className="text-[10px] text-gray-400 line-through mb-0.5">
                                {formatPrice(originalPrice)}
                            </div>
                            <div className="font-bold text-gray-900 text-[15px] leading-none">
                                {currentVariant ? formatPrice(currentVariant.price) : formatPrice(product.basePrice)}
                            </div>
                        </div>

                        <div className="h-8">
                            {quantity === 0 ? (
                                <button
                                    onClick={handleAdd}
                                    disabled={!currentVariant?.isAvailable}
                                    className={cn(
                                        'h-full flex items-center justify-center px-4 rounded-lg text-xs font-bold uppercase transition-all min-w-[70px]',
                                        currentVariant?.isAvailable
                                            ? 'border border-green-600 text-green-700 bg-white hover:bg-green-50 shadow-sm active:scale-95'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                    )}
                                >
                                    Add
                                </button>
                            ) : (
                                <div className="h-full flex items-center bg-green-600 text-white rounded-lg shadow-sm overflow-hidden">
                                    <button
                                        onClick={handleDecrement}
                                        className="w-7 h-full flex items-center justify-center hover:bg-green-700 transition-colors"
                                    >
                                        <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="w-6 text-center text-xs font-bold">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={handleIncrement}
                                        className="w-7 h-full flex items-center justify-center hover:bg-green-700 transition-colors"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
