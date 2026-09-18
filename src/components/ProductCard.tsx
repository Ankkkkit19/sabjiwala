'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Check } from 'lucide-react';
import { Product, getAvailablePreparations, getAvailableWeights, PREPARATION_LABELS, PRODUCT_IMAGES } from '@/lib/data';
import { useCartStore } from '@/lib/store';
import { formatPrice, formatWeight, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const defaultPrep = getAvailablePreparations(product)[0];
    const defaultWeight = getAvailableWeights(product, defaultPrep)[0] ?? 500;
    const [added, setAdded] = useState(false);

    const addItem = useCartStore(s => s.addItem);

    const currentVariant = product.variants.find(
        v => v.preparationType === defaultPrep && v.weight === defaultWeight
    );

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!currentVariant) return;

        addItem(product, currentVariant);
        setAdded(true);
        toast.success(`${product.name} added!`);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <Link href={`/${product.category === 'VEGETABLES' ? 'vegetables' : 'fruits'}/${product.slug}`}>
            <div className="bg-white hover:shadow-md transition-shadow duration-200 rounded-xl overflow-hidden flex flex-col h-full border border-gray-100 relative group">

                {/* Image Container */}
                <div className="relative aspect-square p-2 flex items-center justify-center bg-white overflow-hidden">
                    {PRODUCT_IMAGES[product.id] ? (
                        <img
                            src={PRODUCT_IMAGES[product.id]}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                            {product.emoji ?? '🥦'}
                        </span>
                    )}

                    {/* Delivery Badge Mimicking Blinkit */}
                    <div className="absolute top-0 left-0 bg-white border border-gray-100 shadow-sm rounded-br-lg rounded-tl-xl px-1.5 py-0.5 text-[9px] font-bold text-green-700 flex items-center gap-0.5 z-10">
                        <span className="text-[10px]">⏱️</span> 30 MINS
                    </div>
                </div>

                {/* Content */}
                <div className="p-3 flex flex-col flex-1 border-t border-gray-50">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 md:line-clamp-1 mb-1">
                        {product.name}
                    </h3>

                    {/* Default Variant text */}
                    <div className="text-xs text-gray-500 mb-3">
                        {formatWeight(defaultWeight)} • {PREPARATION_LABELS[defaultPrep]}
                    </div>

                    {/* Price & Add Button */}
                    <div className="flex items-center justify-between mt-auto">
                        <div className="font-bold text-gray-900 text-sm">
                            {currentVariant ? formatPrice(currentVariant.price) : formatPrice(product.basePrice)}
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={!currentVariant?.isAvailable}
                            className={cn(
                                'flex items-center justify-center px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all min-w-[64px]',
                                added
                                    ? 'bg-green-600 text-white'
                                    : currentVariant?.isAvailable
                                        ? 'border border-green-600 text-green-700 bg-green-50 hover:bg-green-100 active:scale-95'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                            )}
                        >
                            {added ? 'Added' : 'Add'}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
