'use client';

import React, { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { fruits } from '@/lib/data';
import { Search, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORIES = ['All', 'Everyday Fruits', 'Seasonal Fruits', 'Premium Fruits'];
const SORT_OPTIONS = [
    { label: 'Popular', value: 'popular' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Name A–Z', value: 'name_asc' },
];

export default function FruitsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('popular');
    const [showSeasonal, setShowSeasonal] = useState(false);

    const filtered = useMemo(() => {
        let results = [...fruits];
        if (searchQuery) {
            results = results.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        if (selectedCategory !== 'All') {
            results = results.filter(p => p.subcategory === selectedCategory);
        }
        if (showSeasonal) {
            results = results.filter(p => p.isSeasonal);
        }
        switch (sortBy) {
            case 'price_asc': results.sort((a, b) => a.basePrice - b.basePrice); break;
            case 'price_desc': results.sort((a, b) => b.basePrice - a.basePrice); break;
            case 'name_asc': results.sort((a, b) => a.name.localeCompare(b.name)); break;
            default: results.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
        }
        return results;
    }, [searchQuery, selectedCategory, sortBy, showSeasonal]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 py-8 border-b border-orange-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <h1 className="text-3xl font-black text-gray-900 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        🍎 Fresh Fruits
                    </h1>
                    <p className="text-gray-600 text-sm">
                        {fruits.length}+ fruits · Whole or ready-to-eat
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search fruits..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none cursor-pointer"
                        >
                            {SORT_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all',
                                selectedCategory === cat
                                    ? 'bg-orange-400 text-white border-orange-400'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                    <button
                        onClick={() => setShowSeasonal(!showSeasonal)}
                        className={cn(
                            'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all',
                            showSeasonal ? 'bg-yellow-400 text-white border-yellow-400' : 'bg-white text-gray-600 border-gray-200'
                        )}
                    >
                        ☀️ Seasonal
                    </button>
                </div>

                <p className="text-sm text-gray-500 mb-4">Showing {filtered.length} fruits</p>

                {filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No fruits found</h3>
                        <p className="text-gray-500">Try adjusting your search</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filtered.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
