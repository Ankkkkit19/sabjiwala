'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { vegetables, fruits } from '@/lib/data';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const popularVegetables = vegetables.slice(0, 10);
  const popularFruits = fruits.slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Main Container - Quick Commerce Layout */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-[80px] pb-16">

        {/* Mobile Search */}
        <div className="md:hidden mt-2 mb-4">
          <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-100 flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-400 ml-2 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                }
              }}
              placeholder="Search vegetables, fruits..."
              className="flex-1 bg-transparent py-1 outline-none text-gray-800 placeholder-gray-400 text-sm"
            />
          </div>
        </div>

        {/* Categories / Navigation Chips */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2 mb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          {[
            { emoji: '🥕', label: 'Vegetables', href: '/vegetables' },
            { emoji: '🍎', label: 'Fruits', href: '/fruits' },
            { emoji: '🍛', label: 'Recipe Kits', href: '/recipes' },
            { emoji: '👨‍🍳', label: 'What to Cook?', href: '/what-should-i-cook' },
            { emoji: '🎁', label: 'Offers', href: '/offers' },
          ].map(cat => (
            <Link
              key={cat.href}
              href={cat.href}
              className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-xl text-sm font-semibold whitespace-nowrap border border-gray-100 hover:border-green-400 hover:bg-green-50 shadow-sm text-gray-700 transition-all flex-shrink-0"
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </Link>
          ))}
        </div>

        {/* Promo Banner */}
        <div className="mb-8 rounded-2xl overflow-hidden bg-gradient-to-r from-green-600 to-green-400 p-6 text-white shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Sabjiwala Fresh Cuts</h2>
            <p className="opacity-90 max-w-sm text-sm">Farm fresh vegetables, professionally cleaned, cut, and delivered in 30 minutes.</p>
          </div>
          <div className="hidden sm:block text-5xl">🥗</div>
        </div>

        <div className="space-y-10">
          {/* Vegetables Grid */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Fresh Pre-cut Vegetables
              </h2>
              <Link href="/vegetables" className="text-green-600 font-semibold text-sm hover:text-green-700">
                See all
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {popularVegetables.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* Fruits Grid */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Fresh Fruits
              </h2>
              <Link href="/fruits" className="text-green-600 font-semibold text-sm hover:text-green-700">
                See all
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {popularFruits.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
