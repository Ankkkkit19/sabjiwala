'use client';

import React, { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { vegetables } from '@/lib/data';
import { Search, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const CATEGORIES = [
    { id: 'All', name: 'All Vegetables', icon: '🥕' },
    { id: 'Root Vegetables', name: 'Root Vegetables', icon: '🥔' },
    { id: 'Leafy Vegetables', name: 'Leafy Vegetables', icon: '🥬' },
    { id: 'Other Vegetables', name: 'Other Vegetables', icon: '🍅' },
];

export default function VegetablesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filtered = useMemo(() => {
        let results = [...vegetables];

        if (searchQuery) {
            results = results.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        if (selectedCategory !== 'All') {
            results = results.filter(p => p.subcategory === selectedCategory);
        }

        return results;
    }, [searchQuery, selectedCategory]);

    return (
        <div className="min-h-screen bg-[#f8f8f8]">
            <Navbar />

            {/* Breadcrumb Navigation - Blinkit Style */}
            <div className="bg-white border-b border-gray-200 sticky top-[72px] z-30 hidden md:block">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
                    <div className="flex items-center text-xs text-gray-500 font-medium">
                        <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
                        <ChevronRight className="w-3 h-3 mx-1" />
                        <span className="text-gray-900 font-bold">Vegetables</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row gap-6">

                {/* Desktop Sidebar (Blinkit style) */}
                <aside className="hidden md:block w-64 flex-shrink-0">
                    <div className="sticky top-[130px] bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                            <h2 className="font-bold text-gray-900 text-sm">Categories</h2>
                        </div>
                        <ul className="flex flex-col">
                            {CATEGORIES.map(cat => (
                                <li key={cat.id}>
                                    <button
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={cn(
                                            'w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left border-l-4',
                                            selectedCategory === cat.id
                                                ? 'bg-green-50 text-green-700 border-green-600'
                                                : 'bg-white text-gray-700 border-transparent hover:bg-gray-50'
                                        )}
                                    >
                                        <span className="text-xl">{cat.icon}</span>
                                        {cat.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Mobile Categories (Horizontal Scroll) */}
                <div className="md:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sticky top-[72px] bg-[#f8f8f8] z-20 pt-2">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={cn(
                                'flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all shadow-sm',
                                selectedCategory === cat.id
                                    ? 'bg-green-600 text-white border-green-600'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-green-300'
                            )}
                        >
                            <span>{cat.icon}</span>
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    {/* Header + Search */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-gray-900 mb-1">
                                {selectedCategory === 'All' ? 'Buy Fresh Vegetables Online' : `Buy ${selectedCategory}`}
                            </h1>
                            <p className="text-xs text-gray-500 font-medium">
                                Delivered fresh to your door in minutes
                            </p>
                        </div>

                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder={`Search in ${selectedCategory}...`}
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:bg-white transition-colors"
                            />
                        </div>
                    </div>

                    {/* Product Grid */}
                    {filtered.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                            <div className="text-6xl mb-4 opacity-50">🔍</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">No products found</h3>
                            <p className="text-sm text-gray-500">We couldn't find anything matching your search.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                            {filtered.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            <Footer />
        </div>
    );
}
