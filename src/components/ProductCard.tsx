'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Star, Plus, Minus, Check } from 'lucide-react';
import { Product, PreparationType, getAvailablePreparations, getAvailableWeights, PREPARATION_LABELS, PRODUCT_IMAGES } from '@/lib/data';
import { useCartStore, useWishlistStore } from '@/lib/store';
import { formatPrice, formatWeight, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ProductCardProps {
    product: Product;
    showVariantSelector?: boolean;
}

export default function ProductCard({ product, showVariantSelector = false }: ProductCardProps) {
    const [selectedPrep, setSelectedPrep] = useState<PreparationType>(
        getAvailablePreparations(product)[0]
    );
    const [selectedWeight, setSelectedWeight] = useState<number>(
        getAvailableWeights(product, getAvailablePreparations(product)[0])[0] ?? 500
    );
    const [added, setAdded] = useState(false);

    const addItem = useCartStore(s => s.addItem);
    const { toggle, isWishlisted } = useWishlistStore();
    const wishlisted = isWishlisted(product.id);

    const availablePreps = getAvailablePreparations(product);
    const availableWeights = getAvailableWeights(product, selectedPrep);

    const currentVariant = product.variants.find(
        v => v.preparationType === selectedPrep && v.weight === selectedWeight
    );

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!currentVariant) return;

        addItem(product, currentVariant);
        setAdded(true);
        toast.success(`${product.name} added to cart!`, {
            icon: '🛒',
        });
        setTimeout(() => setAdded(false), 2000);
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(product.id);
        toast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist', {
            icon: wishlisted ? '💔' : '❤️',
        });
    };

    const handlePrepChange = (prep: PreparationType) => {
        setSelectedPrep(prep);
        const weights = getAvailableWeights(product, prep);
        if (!weights.includes(selectedWeight)) {
            setSelectedWeight(weights[0] ?? 500);
        }
    };

    return (
        <Link href={`/${product.category === 'VEGETABLES' ? 'vegetables' : 'fruits'}/${product.slug}`}>
            <div className="product-card group h-full flex flex-col">
                {/* Image */}
                <div className="relative aspect-square bg-white overflow-hidden flex items-center justify-center rounded-t-2xl">
                    {PRODUCT_IMAGES[product.id] ? (
                        <img src={PRODUCT_IMAGES[product.id]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                        <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
                            {product.emoji ?? '🥦'}
                        </span>
                    )}

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.isSeasonal && (
                            <span className="bg-orange-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Seasonal
                            </span>
                        )}
                        {product.tags?.includes('popular') && (
                            <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Popular
                            </span>
                        )}
                    </div>

                    {/* Wishlist */}
                    <button
                        onClick={handleWishlist}
                        className={cn(
                            'absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all',
                            wishlisted
                                ? 'bg-red-50 text-red-500'
                                : 'bg-white/80 text-gray-400 opacity-0 group-hover:opacity-100'
                        )}
                    >
                        <Heart className={cn('w-4 h-4', wishlisted && 'fill-red-500')} />
                    </button>

                    {/* Stock badge */}
                    {currentVariant && currentVariant.stock < 10 && (
                        <div className="absolute bottom-2 left-2 bg-red-50 border border-red-200 text-red-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            Only {currentVariant.stock} left
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-3 flex flex-col flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm mb-0.5">{product.name}</h3>

                    {/* Rating */}
                    {product.rating && (
                        <div className="flex items-center gap-1 mb-2">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium text-gray-700">{product.rating}</span>
                            {product.reviewCount && (
                                <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
                            )}
                        </div>
                    )}

                    {/* Prep selector */}
                    <div className="flex flex-wrap gap-1 mb-2">
                        {availablePreps.slice(0, 3).map(prep => (
                            <button
                                key={prep}
                                onClick={e => { e.preventDefault(); e.stopPropagation(); handlePrepChange(prep); }}
                                className={cn(
                                    'text-[10px] px-2 py-0.5 rounded-full border font-medium transition-all',
                                    selectedPrep === prep
                                        ? 'bg-green-500 text-white border-green-500'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
                                )}
                            >
                                {PREPARATION_LABELS[prep]}
                            </button>
                        ))}
                        {availablePreps.length > 3 && (
                            <span className="text-[10px] text-gray-400 flex items-center">+{availablePreps.length - 3}</span>
                        )}
                    </div>

                    {/* Weight selector */}
                    <div className="flex flex-wrap gap-1 mb-3">
                        {availableWeights.slice(0, 3).map(w => (
                            <button
                                key={w}
                                onClick={e => { e.preventDefault(); e.stopPropagation(); setSelectedWeight(w); }}
                                className={cn(
                                    'text-[10px] px-2 py-0.5 rounded-full border font-medium transition-all',
                                    selectedWeight === w
                                        ? 'bg-gray-800 text-white border-gray-800'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                                )}
                            >
                                {formatWeight(w)}
                            </button>
                        ))}
                    </div>

                    {/* Footer: Price + Add */}
                    <div className="flex items-center justify-between mt-auto gap-2">
                        <div>
                            <div className="font-bold text-gray-900 text-base">
                                {currentVariant ? formatPrice(currentVariant.price) : formatPrice(product.basePrice)}
                            </div>
                            <div className="text-[10px] text-gray-400">
                                {formatWeight(selectedWeight)} · {PREPARATION_LABELS[selectedPrep]}
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={!currentVariant?.isAvailable}
                            className={cn(
                                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all',
                                added
                                    ? 'bg-green-50 text-green-600 border border-green-200'
                                    : currentVariant?.isAvailable
                                        ? 'bg-green-500 text-white hover:bg-green-600 hover:shadow-md active:scale-95'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            )}
                        >
                            {added ? (
                                <>
                                    <Check className="w-3.5 h-3.5" /> Added
                                </>
                            ) : (
                                <>
                                    <Plus className="w-3.5 h-3.5" /> Add
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
