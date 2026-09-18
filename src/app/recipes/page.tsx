'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Clock, Users, ChefHat, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { recipes } from '@/lib/data';
import { cn } from '@/lib/utils';

const CATEGORIES = ['All', 'Sabzi', 'Gravy', 'Rice', 'Salad'];

export default function RecipesPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filtered = selectedCategory === 'All'
        ? recipes
        : recipes.filter(r => r.category === selectedCategory);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="bg-gradient-to-br from-amber-50 to-orange-100 py-10 border-b border-orange-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
                    <h1 className="text-4xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        🍛 Recipe Kits
                    </h1>
                    <p className="text-gray-600 max-w-lg mx-auto">
                        Choose a dish, we prepare all the ingredients. Perfectly cut, hygienically packed.
                    </p>
                    <Link
                        href="/what-should-i-cook"
                        className="inline-flex items-center gap-2 mt-4 bg-gray-900 text-white px-6 py-2.5 rounded-2xl text-sm font-semibold hover:bg-gray-800 transition-colors"
                    >
                        <ChefHat className="w-4 h-4 text-green-400" />
                        Use "What Should I Cook?" flow
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Category filter */}
                <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                'flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium border transition-all',
                                selectedCategory === cat
                                    ? 'bg-amber-500 text-white border-amber-500'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300'
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Recipe Grid */}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {filtered.map(recipe => (
                        <Link key={recipe.id} href={`/recipes/${recipe.slug}`}>
                            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-amber-200 hover:shadow-lg transition-all group h-full flex flex-col">
                                <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-8 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                                    {recipe.emoji}
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <h3 className="font-bold text-gray-900 mb-1">{recipe.name}</h3>
                                    {recipe.description && (
                                        <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-1">{recipe.description}</p>
                                    )}
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-3 text-xs text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3 h-3" />{recipe.baseServings}+ people
                                            </span>
                                            {recipe.prepTime && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />{recipe.prepTime}m
                                                </span>
                                            )}
                                        </div>
                                        {recipe.isPopular && (
                                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                                                Popular
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-xs text-gray-400">{recipe.ingredients.length} ingredients</span>
                                        <span className="flex items-center gap-1 text-amber-500 font-semibold text-sm group-hover:gap-2 transition-all">
                                            View Kit <ArrowRight className="w-3.5 h-3.5" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
}
