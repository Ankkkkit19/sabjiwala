'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { recipes, calculateRecipeIngredients, getProductById, PREPARATION_LABELS, PreparationType, PRODUCT_IMAGES, RECIPE_IMAGES } from '@/lib/data';
import { useCartStore } from '@/lib/store';
import { ChefHat, Plus, Check, Users, Clock, Search, ArrowRight, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatPrice, formatWeight, cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';

const SERVING_OPTIONS = [1, 2, 3, 4, 5, 6, 8, 10];

export default function WhatShouldICookPage() {
    const [step, setStep] = useState(1); // 1: recipe, 2: servings, 3: ingredients
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRecipe, setSelectedRecipe] = useState<typeof recipes[0] | null>(null);
    const [servings, setServings] = useState(2);
    const [addedIngredients, setAddedIngredients] = useState<Set<string>>(new Set());

    const addItem = useCartStore(s => s.addItem);

    const filteredRecipes = recipes.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.category ?? '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const calculatedIngredients = selectedRecipe
        ? calculateRecipeIngredients(selectedRecipe, servings)
        : [];

    const handleAddIngredient = (ingredient: typeof calculatedIngredients[0]) => {
        const product = getProductById(ingredient.productId);
        if (!product) return;

        // Find best variant
        const variant = product.variants.find(
            v => v.preparationType === ingredient.preparationType && v.isAvailable
        ) ?? product.variants.find(v => v.isAvailable);

        if (!variant) {
            toast.error(`${ingredient.productName} is out of stock`);
            return;
        }

        addItem(product, variant);
        setAddedIngredients(prev => new Set(prev).add(ingredient.productId));
        toast.success(`${ingredient.productName} added to cart!`);
    };

    const handleAddAll = () => {
        let count = 0;
        calculatedIngredients.forEach(ing => {
            const product = getProductById(ing.productId);
            if (!product) return;
            const variant = product.variants.find(v => v.preparationType === ing.preparationType && v.isAvailable)
                ?? product.variants.find(v => v.isAvailable);
            if (variant) {
                addItem(product, variant);
                count++;
            }
        });
        setAddedIngredients(new Set(calculatedIngredients.map(i => i.productId)));
        toast.success(`${count} ingredients added to cart!`, { icon: '🛒' });
    };

    const estimatedTotal = calculatedIngredients.reduce((sum, ing) => {
        const product = getProductById(ing.productId);
        if (!product) return sum;
        const variant = product.variants.find(v => v.preparationType === ing.preparationType && v.isAvailable)
            ?? product.variants.find(v => v.isAvailable);
        return sum + (variant?.price ?? 0);
    }, 0);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Header */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 py-10 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm font-medium mb-4">
                        <ChefHat className="w-4 h-4 text-green-400" />
                        Sabjiwala's Signature Feature
                    </div>
                    <h1 className="text-4xl font-black mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        👨‍🍳 What Should I Cook?
                    </h1>
                    <p className="text-gray-400 max-w-lg mx-auto">
                        Choose a dish. Tell us how many people. We calculate and prepare all the ingredients.
                    </p>
                </div>
            </div>

            {/* Step indicator */}
            <div className="bg-white border-b border-gray-100 py-4">
                <div className="max-w-4xl mx-auto px-4 flex items-center justify-center gap-0">
                    {[
                        { num: 1, label: 'Choose Dish' },
                        { num: 2, label: 'Servings' },
                        { num: 3, label: 'Add Ingredients' },
                    ].map((s, i) => (
                        <React.Fragment key={s.num}>
                            <button
                                onClick={() => {
                                    if (s.num < step || (s.num === 2 && selectedRecipe) || (s.num === 3 && selectedRecipe)) {
                                        setStep(s.num);
                                    }
                                }}
                                className={cn(
                                    'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all',
                                    step >= s.num ? 'text-green-700 bg-green-50' : 'text-gray-400 bg-gray-50'
                                )}
                            >
                                <span className={cn(
                                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                                    step > s.num ? 'bg-green-500 text-white' : step === s.num ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                                )}>
                                    {step > s.num ? '✓' : s.num}
                                </span>
                                <span className="hidden sm:inline">{s.label}</span>
                            </button>
                            {i < 2 && <div className={cn('w-16 h-0.5 transition-colors', step > s.num ? 'bg-green-400' : 'bg-gray-200')} />}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                {/* Step 1: Choose dish */}
                {step === 1 && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">What do you want to cook?</h2>
                        <p className="text-gray-500 text-center mb-8">Choose from our popular dishes or search for something specific.</p>

                        <div className="relative mb-6">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search Aloo Gobi, Biryani, Salad..."
                                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 shadow-sm"
                            />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {filteredRecipes.map(recipe => (
                                <button
                                    key={recipe.id}
                                    onClick={() => { setSelectedRecipe(recipe); setStep(2); setAddedIngredients(new Set()); }}
                                    className={cn(
                                        'p-4 rounded-2xl border-2 text-center transition-all hover:scale-102 hover:shadow-md',
                                        selectedRecipe?.id === recipe.id
                                            ? 'border-green-500 bg-green-50'
                                            : 'border-gray-100 bg-white hover:border-green-300'
                                    )}
                                >
                                    <div className="w-full h-24 mb-2 -mt-4 -mx-4 rounded-t-2xl overflow-hidden bg-gray-100 mb-3 border-b border-gray-100">
                                        <img src={RECIPE_IMAGES[recipe.id]} alt={recipe.name} className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{recipe.name}</h3>
                                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                                        {recipe.prepTime && (
                                            <span className="flex items-center gap-0.5">
                                                <Clock className="w-3 h-3" />{recipe.prepTime}m
                                            </span>
                                        )}
                                        {recipe.category && <span>{recipe.category}</span>}
                                    </div>
                                    {recipe.isPopular && (
                                        <span className="inline-block mt-2 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                                            Popular
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {filteredRecipes.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-5xl mb-3">🔍</div>
                                <p className="text-gray-500">No recipes found. Try a different search.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 2: Servings */}
                {step === 2 && selectedRecipe && (
                    <div>
                        <button onClick={() => setStep(1)} className="flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-6 text-sm">
                            <ChevronLeft className="w-4 h-4" /> Back to recipes
                        </button>

                        <div className="text-center mb-8">
                            <img src={RECIPE_IMAGES[selectedRecipe.id]} alt={selectedRecipe.name} className="w-24 h-24 object-cover rounded-full mx-auto mb-4 border-4 border-white shadow-md max-w-sm" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {selectedRecipe.name}
                            </h2>
                            {selectedRecipe.description && (
                                <p className="text-gray-500 text-sm max-w-md mx-auto">{selectedRecipe.description}</p>
                            )}
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 text-center mb-6">
                            <Users className="inline w-5 h-5 mr-2 text-green-500" />
                            How many people are you cooking for?
                        </h3>

                        <div className="flex flex-wrap justify-center gap-3 mb-8">
                            {SERVING_OPTIONS.map(n => (
                                <button
                                    key={n}
                                    onClick={() => setServings(n)}
                                    className={cn(
                                        'w-16 h-16 rounded-2xl border-2 font-bold text-lg transition-all',
                                        servings === n
                                            ? 'bg-green-500 text-white border-green-500 scale-110 shadow-lg'
                                            : 'bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:scale-105'
                                    )}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>

                        <div className="text-center">
                            <p className="text-gray-500 text-sm mb-6">
                                Cooking for <strong className="text-green-600">{servings} {servings === 1 ? 'person' : 'people'}</strong>
                            </p>
                            <button
                                onClick={() => setStep(3)}
                                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3.5 rounded-2xl font-bold transition-colors shadow-md mx-auto"
                            >
                                Calculate Ingredients <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Ingredients */}
                {step === 3 && selectedRecipe && (
                    <div>
                        <button onClick={() => setStep(2)} className="flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-6 text-sm">
                            <ChevronLeft className="w-4 h-4" /> Change servings
                        </button>

                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    {selectedRecipe.name}
                                </h2>
                                <p className="text-sm text-gray-500">For {servings} {servings === 1 ? 'person' : 'people'}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-400">Estimated total</div>
                                <div className="font-bold text-xl text-gray-900">{formatPrice(estimatedTotal)}</div>
                            </div>
                        </div>

                        {/* Ingredients table */}
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
                            <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
                                <div className="grid grid-cols-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <span className="col-span-2">Ingredient</span>
                                    <span className="text-center">Quantity</span>
                                    <span className="text-right">Action</span>
                                </div>
                            </div>
                            {calculatedIngredients.map((ing, i) => {
                                const isAdded = addedIngredients.has(ing.productId);
                                const product = getProductById(ing.productId);
                                return (
                                    <div key={i} className={cn('px-5 py-4 border-b border-gray-50 last:border-0 flex items-center', isAdded && 'bg-green-50')}>
                                        <div className="flex items-center gap-3 flex-1">
                                            <img src={PRODUCT_IMAGES[ing.productId]} alt={ing.productName} className="w-10 h-10 object-cover rounded-full bg-gray-100 shrink-0 shadow-sm" />
                                            <div>
                                                <div className="font-medium text-gray-900 text-sm">{ing.productName}</div>
                                                <div className="text-xs text-green-600 font-medium">{PREPARATION_LABELS[ing.preparationType]}</div>
                                            </div>
                                        </div>
                                        <div className="text-center w-24">
                                            <span className="font-semibold text-gray-900 text-sm">{formatWeight(ing.quantity)}</span>
                                        </div>
                                        <div className="text-right w-24">
                                            <button
                                                onClick={() => handleAddIngredient(ing)}
                                                className={cn(
                                                    'flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ml-auto',
                                                    isAdded
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-green-500 text-white hover:bg-green-600'
                                                )}
                                            >
                                                {isAdded ? (
                                                    <><Check className="w-3 h-3" /> Added</>
                                                ) : (
                                                    <><Plus className="w-3 h-3" /> Add</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Add all button */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleAddAll}
                                className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-2xl font-bold transition-colors shadow-md text-sm"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Add All Ingredients to Cart
                            </button>
                            <Link
                                href="/cart"
                                className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3.5 rounded-2xl font-bold transition-colors text-sm"
                            >
                                View Cart <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Cook another */}
                        <div className="text-center mt-6">
                            <button
                                onClick={() => { setStep(1); setSelectedRecipe(null); setAddedIngredients(new Set()); }}
                                className="text-sm text-green-600 hover:text-green-700 font-semibold"
                            >
                                + Cook another dish
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
