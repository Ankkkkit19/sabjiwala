'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { allProducts, recipes } from '@/lib/data';

function SearchContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') ?? '';
    const [query, setQuery] = useState(initialQuery);

    const productResults = useMemo(() => {
        if (!query.trim()) return [];
        const q = query.toLowerCase();
        return allProducts.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.slug.includes(q) ||
            p.tags.some(t => t.includes(q)) ||
            (p.subcategory ?? '').toLowerCase().includes(q)
        );
    }, [query]);

    const recipeResults = useMemo(() => {
        if (!query.trim()) return [];
        const q = query.toLowerCase();
        return recipes.filter(r =>
            r.name.toLowerCase().includes(q) ||
            (r.category ?? '').toLowerCase().includes(q) ||
            r.ingredients.some(i => i.productName.toLowerCase().includes(q))
        );
    }, [query]);

    const suggestions = ['Potato', 'Onion', 'Tomato', 'Carrot', 'Aloo Gobi', 'Salad', 'Watermelon', 'Spinach'];

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
            {/* Search box */}
            <div className="relative mb-8 max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search vegetables, fruits, recipes..."
                    autoFocus
                    className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-200 focus:border-green-400 rounded-2xl text-base focus:outline-none focus:ring-4 focus:ring-green-50 shadow-sm"
                />
                {query && (
                    <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {!query.trim() ? (
                <div>
                    <h3 className="font-semibold text-gray-700 mb-4 text-sm">Popular Searches</h3>
                    <div className="flex flex-wrap gap-2">
                        {suggestions.map(s => (
                            <button
                                key={s}
                                onClick={() => setQuery(s)}
                                className="px-4 py-2 bg-white border border-gray-200 hover:border-green-300 hover:text-green-600 rounded-full text-sm text-gray-600 transition-all"
                            >
                                🔍 {s}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    {productResults.length === 0 && recipeResults.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results for "{query}"</h3>
                            <p className="text-gray-500 mb-6">Try a different search term</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {suggestions.slice(0, 4).map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setQuery(s)}
                                        className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-full text-sm font-medium"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Products */}
                            {productResults.length > 0 && (
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                                        🥕 Products ({productResults.length})
                                    </h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {productResults.map(product => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Recipe results */}
                            {recipeResults.length > 0 && (
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                                        🍛 Recipe Kits ({recipeResults.length})
                                    </h2>
                                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {recipeResults.map(recipe => (
                                            <Link key={recipe.id} href={`/recipes/${recipe.slug}`}>
                                                <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-green-200 hover:shadow-md transition-all flex items-center gap-4">
                                                    <span className="text-4xl">{recipe.emoji}</span>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">{recipe.name}</h3>
                                                        <p className="text-xs text-gray-500">{recipe.ingredients.length} ingredients</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="bg-white border-b border-gray-100 py-4">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <h1 className="text-xl font-black text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        🔍 Search Sabjiwala
                    </h1>
                </div>
            </div>
            <Suspense fallback={<div className="p-8 text-center text-gray-400">Loading...</div>}>
                <SearchContent />
            </Suspense>
            <Footer />
        </div>
    );
}
