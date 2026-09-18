'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight, Search, ChefHat, CheckCircle, Shield,
  Award, Clock, Zap, Heart
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { vegetables, fruits, recipes, RECIPE_IMAGES } from '@/lib/data';

const HOW_IT_WORKS = [
  { step: '01', title: 'Choose', desc: 'Select vegetables or a recipe.', icon: '🛒' },
  { step: '02', title: 'Prepare', desc: 'We wash, peel and cut.', icon: '🔪' },
  { step: '03', title: 'Pack', desc: 'Packed carefully in food-grade packaging.', icon: '📦' },
  { step: '04', title: 'Deliver', desc: 'Delivered to your doorstep.', icon: '🛵' },
];

const TRUST_ITEMS = [
  { label: 'Fresh Ingredients', desc: 'Farm-sourced daily', icon: Heart },
  { label: 'Prepared Your Way', desc: 'Cut exactly how you want', icon: ChefHat },
  { label: 'Hygienic Packaging', desc: 'Safe, premium plastic packaging', icon: Shield },
  { label: 'Fast Delivery', desc: 'Delivered in 30–45 mins', icon: Clock },
  { label: 'Accurate Weight', desc: 'Exact weight, no shortcuts', icon: Award },
  { label: 'Quality First', desc: 'Strict hygiene standards', icon: CheckCircle },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const popularVegetables = vegetables.filter(v => v.tags.includes('popular')).slice(0, 5);
  const popularFruits = fruits.slice(0, 5);
  const popularRecipes = recipes.filter(r => r.isPopular).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#faf9f8] flex flex-col font-sans text-gray-900">
      <Navbar />

      <main className="flex-1 w-full pt-[64px]">
        {/* HOMEPAGE HERO (Section 6) */}
        <section className="relative w-full bg-[#f4f7f4] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-100/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
          </div>

          <div className="max-w-[1300px] mx-auto px-4 sm:px-6 py-16 md:py-24 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-left animate-fade-in-up">
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-[1.1] mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Fresh vegetables.<br />
                  <span className="text-green-600">Already prepared.</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
                  Washed, peeled, and freshly cut vegetables delivered to your doorstep. Save time, cook better, live fresher.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/vegetables" className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-green-600/20 active:scale-95 text-sm md:text-base">
                    Shop Vegetables
                  </Link>
                  <Link href="/what-should-i-cook" className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl font-bold transition-all shadow-sm active:scale-95 flex items-center gap-2 text-sm md:text-base">
                    <ChefHat className="w-5 h-5 text-green-600" />
                    What Should I Cook?
                  </Link>
                </div>
              </div>

              <div className="relative flex justify-center md:justify-end">
                <div className="relative w-full max-w-md aspect-square bg-white rounded-[40px] shadow-2xl p-4 border border-white/50 rotate-2 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="/images/diced_potatoes_box_1789744925141.png"
                    alt="Freshly diced potatoes"
                    className="w-full h-full object-cover rounded-[32px]"
                  />
                  <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce-subtle">
                    <span className="text-3xl">🥦</span>
                    <div>
                      <div className="text-xs text-green-600 font-bold uppercase tracking-wider">Premium Quality</div>
                      <div className="font-bold text-gray-900">Farm Sourced Daily</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORY SHORTCUTS (Section 7) */}
        <section className="max-w-[1300px] mx-auto px-4 sm:px-6 -mt-8 relative z-20 mb-16">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-4 snap-x">
            {[
              { emoji: '🥕', label: 'Vegetables', href: '/vegetables', color: 'bg-orange-50' },
              { emoji: '🍎', label: 'Fruits', href: '/fruits', color: 'bg-red-50' },
              { emoji: '🔪', label: 'Cut Vegetables', href: '/vegetables?category=cut', color: 'bg-green-50' },
              { emoji: '🍛', label: 'Recipe Kits', href: '/recipes', color: 'bg-amber-50' },
              { emoji: '🥗', label: 'Salad', href: '/vegetables?category=salad', color: 'bg-lime-50' },
              { emoji: '🔥', label: 'Offers', href: '/offers', color: 'bg-purple-50' },
            ].map((cat, i) => (
              <Link
                key={i}
                href={cat.href}
                className={`snap-start flex flex-col justify-center items-center gap-2 p-4 min-w-[110px] bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 hover:border-green-200 hover:-translate-y-1 transition-all flex-shrink-0 ${cat.color}`}
              >
                <span className="text-3xl filter drop-shadow-sm">{cat.emoji}</span>
                <span className="text-xs font-bold text-gray-800 whitespace-nowrap">{cat.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* "WHAT SHOULD I COOK?" FEATURE (Section 8) */}
        <section className="bg-[#fef9f3] py-16 border-y border-[#fce9d3] mb-16 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-orange-200/30 blur-3xl rounded-full mix-blend-multiply"></div>
          <div className="max-w-[1300px] mx-auto px-4 sm:px-6 relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 font-['Inter']">What are you cooking today? 👨‍🍳</h2>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">Tell us what you're making and we'll calculate the exact ingredients for you.</p>

            <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-xl border border-orange-100/50 max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 w-full text-left relative">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block pl-1">What do you want to cook?</label>
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Aloo Gobi, Biryani, Paneer..." className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white transition-all" />
                </div>
              </div>
              <div className="w-full md:w-auto text-left">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block pl-1">People</label>
                <select className="w-full md:w-32 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white appearance-none cursor-pointer text-gray-900">
                  <option>1 Person</option>
                  <option>2 People</option>
                  <option>3 People</option>
                  <option>4 People</option>
                </select>
              </div>
              <div className="w-full md:w-auto pt-6">
                <Link href="/what-should-i-cook" className="w-full md:w-auto inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-2xl shadow-md transition-colors text-center whitespace-nowrap text-sm">
                  Show Ingredients
                </Link>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Try:</span>
              {['Aloo Gobi', 'Paneer', 'Biryani'].map((tag, i) => (
                <span key={i} className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full cursor-pointer hover:bg-orange-200 transition-colors">{tag}</span>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 space-y-16 pb-16">

          {/* PRODUCT GRIDS (Section 11/12 logic on homepage) */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                Popular Vegetables
              </h2>
              <Link href="/vegetables" className="flex items-center text-sm font-bold text-green-600 hover:text-green-700 hover:underline">
                View all <ChevronRight className="w-4 h-4 ml-0.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {popularVegetables.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                Fresh Fruits
              </h2>
              <Link href="/fruits" className="flex items-center text-sm font-bold text-green-600 hover:text-green-700 hover:underline">
                View all <ChevronRight className="w-4 h-4 ml-0.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {popularFruits.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* OFFERS SECTION (Section 32) */}
          <section className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-[24px] p-8 text-white relative overflow-hidden shadow-lg border border-orange-300">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/20 rounded-full blur-2xl translate-x-12 -translate-y-8"></div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-orange-950 bg-white/40 w-fit px-3 py-1 rounded-full mb-3 backdrop-blur-sm">First Order</div>
              <h3 className="text-3xl font-black mb-2">Get ₹50 OFF</h3>
              <p className="opacity-90 mb-6 text-sm">Use this code on checkout for your first delivery.</p>
              <div className="inline-block bg-white text-orange-600 font-black px-6 py-3 rounded-xl border border-white/50 text-base shadow-sm">FIRST50</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-[24px] p-8 text-white relative overflow-hidden shadow-lg border border-green-400">
              <div className="absolute right-0 bottom-0 w-40 h-40 bg-white/20 rounded-full blur-2xl translate-x-12 translate-y-12"></div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-green-950 bg-white/40 w-fit px-3 py-1 rounded-full mb-3 backdrop-blur-sm">Weekend Special</div>
              <h3 className="text-3xl font-black mb-2">Free Delivery</h3>
              <p className="opacity-90 mb-6 text-sm">On all orders above ₹299 across the city.</p>
              <Link href="/vegetables" className="inline-block bg-gray-900 text-white font-bold px-6 py-3.5 rounded-xl text-sm shadow-sm hover:bg-gray-800 transition-colors">Shop Now</Link>
            </div>
          </section>

          {/* HOW IT WORKS (Section 31) */}
          <section className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-gray-900 mb-3 font-['Inter']">How it works</h2>
              <p className="text-gray-500 max-w-lg mx-auto">From field to your kitchen in four simple steps.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {HOW_IT_WORKS.map((step, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 bg-[#f4f7f4] border border-green-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 text-gray-800">{step.icon}</div>
                  <div className="text-xs font-bold text-gray-400 mb-1 tracking-widest">{step.step}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 max-w-[200px] mx-auto">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* TRUST SECTION (Section 30) */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-gray-900 mb-3 font-['Inter']">Why choose SabjiWala?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TRUST_ITEMS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex flex-col items-center p-6 bg-white rounded-2xl border border-gray-100 text-center hover:border-green-200 transition-colors shadow-sm cursor-default">
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4 border border-green-100/50">
                      <Icon className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{item.label}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
