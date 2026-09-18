'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Search, MapPin, ShoppingCart, User, ChefHat, Menu, X,
    Leaf, Home, Grid3X3, Package, Heart, Tag
} from 'lucide-react';
import { useCartStore, useAuthStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const itemCount = useCartStore(s => s.getItemCount());
    const { user, isLoggedIn } = useAuthStore();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/vegetables', label: 'Vegetables', icon: '🥕' },
        { href: '/fruits', label: 'Fruits', icon: '🍎' },
        { href: '/recipes', label: 'Recipe Kits', icon: '🍛' },
        { href: '/what-should-i-cook', label: 'What to Cook?', icon: '👨‍🍳' },
        { href: '/offers', label: 'Offers', icon: '🎁' },
    ];

    const bottomNavItems = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/vegetables', label: 'Shop', icon: Grid3X3 },
        { href: '/orders', label: 'Orders', icon: Package },
        { href: '/cart', label: 'Cart', icon: ShoppingCart, badge: itemCount },
        { href: '/profile', label: 'Profile', icon: User },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    return (
        <>
            {/* Desktop Navbar */}
            <header
                className={cn(
                    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                    isScrolled
                        ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100'
                        : 'bg-white border-b border-gray-100'
                )}
            >
                {/* Announcement bar */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-center text-xs py-1.5 font-medium tracking-wide">
                    🌿 Fresh vegetables cut & delivered in 30–45 mins · Free delivery above ₹299
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center h-16 gap-4">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
                            <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                                <Leaf className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="font-black text-xl text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                                    Sabji<span className="text-green-500">wala</span>
                                </span>
                                <div className="text-[9px] text-gray-400 font-medium tracking-wider -mt-0.5">SABJI • FRESH • READY</div>
                            </div>
                        </Link>

                        {/* Location selector */}
                        <button className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-green-50 transition-colors border border-transparent hover:border-green-200 text-sm text-gray-600 hover:text-green-600 flex-shrink-0">
                            <MapPin className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="font-medium max-w-[120px] truncate">Select location</span>
                            <span className="text-gray-300">▼</span>
                        </button>

                        {/* Search bar */}
                        <div className="hidden md:flex flex-1 max-w-2xl mx-4">
                            <form onSubmit={handleSearch} className="w-full relative group">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search vegetables, fruits, recipes..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:bg-white focus:ring-2 focus:ring-green-100 transition-all"
                                />
                            </form>
                        </div>

                        {/* Nav Links */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {navLinks.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        'px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                                        pathname === link.href || pathname.startsWith(link.href + '/')
                                            ? 'bg-green-50 text-green-700 font-semibold'
                                            : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Right actions */}
                        <div className="flex items-center gap-2 ml-auto">
                            {/* Mobile search */}
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <Search className="w-5 h-5 text-gray-600" />
                            </button>

                            {/* Wishlist */}
                            <Link href="/profile/wishlist" className="hidden md:flex p-2 rounded-xl hover:bg-gray-100 transition-colors">
                                <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
                            </Link>

                            {/* Account */}
                            <Link
                                href={isLoggedIn ? '/profile' : '/login'}
                                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <User className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">
                                    {isLoggedIn ? user?.name?.split(' ')[0] : 'Login'}
                                </span>
                            </Link>

                            {/* Cart */}
                            <Link
                                href="/cart"
                                className="relative flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all font-medium text-sm shadow-sm hover:shadow-md"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                <span className="hidden sm:inline">Cart</span>
                                {itemCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white">
                                        {itemCount > 9 ? '9+' : itemCount}
                                    </span>
                                )}
                            </Link>

                            {/* Mobile menu */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile search bar */}
                    {isSearchOpen && (
                        <div className="md:hidden pb-3 animate-fade-in">
                            <form onSubmit={handleSearch} className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    autoFocus
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search vegetables, fruits, recipes..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                                />
                            </form>
                        </div>
                    )}

                    {/* Mobile menu */}
                    {isMobileMenuOpen && (
                        <div className="lg:hidden pb-4 border-t border-gray-100 pt-3 animate-fade-in">
                            <nav className="flex flex-col gap-1">
                                {navLinks.map(link => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                                            pathname.startsWith(link.href)
                                                ? 'bg-green-50 text-green-700'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        )}
                                    >
                                        <span className="text-lg">{link.icon}</span>
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="border-t border-gray-100 mt-2 pt-2">
                                    <Link
                                        href={isLoggedIn ? '/profile' : '/login'}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        <User className="w-4 h-4" />
                                        {isLoggedIn ? `Hi, ${user?.name?.split(' ')[0]}` : 'Login / Register'}
                                    </Link>
                                    <Link
                                        href="/offers"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        <Tag className="w-4 h-4" />
                                        Offers & Coupons
                                    </Link>
                                </div>
                            </nav>
                        </div>
                    )}
                </div>
            </header>

            {/* Spacer for fixed header */}
            <div className="h-[calc(2.25rem+4rem)]" />

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden bottom-nav safe-bottom">
                {bottomNavItems.map(item => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all relative',
                                isActive ? 'text-green-600' : 'text-gray-500'
                            )}
                        >
                            <div className="relative">
                                <Icon
                                    className={cn(
                                        'w-5 h-5 transition-transform',
                                        isActive && 'text-green-600 scale-110'
                                    )}
                                />
                                {item.badge !== undefined && item.badge > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-white">
                                        {item.badge > 9 ? '9+' : item.badge}
                                    </span>
                                )}
                            </div>
                            <span className={cn('text-[10px] font-medium', isActive ? 'text-green-600' : 'text-gray-500')}>
                                {item.label}
                            </span>
                            {isActive && (
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-green-500" />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
