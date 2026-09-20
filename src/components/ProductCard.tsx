'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Minus, Clock } from 'lucide-react';
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

    const originalPrice = currentVariant
        ? Math.round(currentVariant.price * 1.2)
        : Math.round(product.basePrice * 1.2);

    return (
        <Link href={`/${product.category === 'VEGETABLES' ? 'vegetables' : 'fruits'}/${product.slug}`}>
            <div className="bg-white hover:shadow-[0px_4px_16px_rgba(0,0,0,0.08)] transition-all duration-200 rounded-xl overflow-hidden flex flex-col h-full border border-gray-200 relative group">

                {/* Image Container (Blinkit Minimal Style) */}
                <div className="relative aspect-[4/3] bg-white flex items-center justify-center overflow-hidden border-b border-gray-100 p-4">
                    {PRODUCT_IMAGES[product.id] ? (
                        <img
                            src={PRODUCT_IMAGES[product.id]}
                            alt={product.name}
                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                            {product.emoji ?? '🥦'}
                        </span>
                    )}

                    {/* Small Delivery Badge */}
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-gray-50/90 backdrop-blur-sm px-1.5 py-0.5 rounded shadow-[0_1px_2px_rgba(0,0,0,0.1)] border border-gray-200">
                        <Clock className="w-2.5 h-2.5 text-gray-500" />
                        <span className="text-[9px] font-bold text-gray-700 tracking-wide uppercase">12 MINS</span>
                    </div>

                    {product.tags?.includes('popular') && (
                        <div className="absolute bottom-0 left-0 bg-blue-100 text-blue-800 text-[9px] font-bold px-2 py-0.5 rounded-tr-lg">
                            BESTSELLER
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-3 flex flex-col flex-1">
                    <h3 className="font-semibold text-gray-800 text-[13px] leading-tight mb-2 line-clamp-2 min-h-[36px]">
                        {product.name} ({PREPARATION_LABELS[defaultPrep]})
                    </h3>

                    <div className="text-[11px] text-gray-500 font-medium mb-4">
                        {formatWeight(defaultWeight)}
                    </div>

                    {/* Price & Add Button */}
                    <div className="flex items-center justify-between mt-auto pt-1">
                        <div className="flex flex-col">
                            <div className="text-[10px] text-gray-400 line-through leading-none mb-0.5">
                                {formatPrice(originalPrice)}
                            </div>
                            <div className="font-bold text-gray-900 text-sm leading-none">
                                {currentVariant ? formatPrice(currentVariant.price) : formatPrice(product.basePrice)}
                            </div>
                        </div>

                        <div className="h-[30px] w-[70px]">
                            {quantity === 0 ? (
                                <button
                                    onClick={handleAdd}
                                    disabled={!currentVariant?.isAvailable}
                                    className={cn(
                                        'w-full h-full flex items-center justify-center rounded-lg text-xs font-bold uppercase transition-all shadow-[0_2px_4px_rgba(49,134,22,0.1)]',
                                        currentVariant?.isAvailable
                                            ? 'border border-green-600 bg-green-50 text-green-700 hover:bg-green-600 hover:text-white'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 shadow-none'
                                    )}
                                >
                                    ADD
                                </button>
                            ) : (
                                <div className="w-full h-full flex items-center justify-between bg-green-600 text-white rounded-lg shadow-[0_2px_4px_rgba(49,134,22,0.2)]">
                                    <button
                                        onClick={handleDecrement}
                                        className="w-7 h-full flex items-center justify-center hover:bg-green-700 transition-colors rounded-l-lg"
                                    >
                                        <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="flex-1 text-center text-xs font-bold">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={handleIncrement}
                                        className="w-7 h-full flex items-center justify-center hover:bg-green-700 transition-colors rounded-r-lg"
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
