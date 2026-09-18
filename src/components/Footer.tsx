import React from 'react';
import Link from 'next/link';
import { Leaf, Globe, MessageCircle, Share2, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-950 text-white mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center">
                                <Leaf className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-black text-xl" style={{ fontFamily: 'Outfit, sans-serif' }}>
                                Fresh<span className="text-green-400">Cut</span>
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed mb-4">
                            Fresh. Cut. Ready to Cook. We prepare your ingredients so you can focus on the joy of cooking.
                        </p>
                        <div className="flex gap-3">
                            {[Globe, MessageCircle, Share2].map((Icon, i) => (
                                <a key={i} href="#" className="w-9 h-9 bg-gray-800 hover:bg-green-500 rounded-xl flex items-center justify-center transition-colors">
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4 text-sm">Shop</h4>
                        <ul className="space-y-2">
                            {[
                                { href: '/vegetables', label: 'Vegetables' },
                                { href: '/fruits', label: 'Fruits' },
                                { href: '/recipes', label: 'Recipe Kits' },
                                { href: '/what-should-i-cook', label: 'What to Cook?' },
                                { href: '/offers', label: 'Offers' },
                            ].map(link => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-gray-400 hover:text-green-400 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h4 className="font-semibold text-white mb-4 text-sm">Account</h4>
                        <ul className="space-y-2">
                            {[
                                { href: '/profile', label: 'My Profile' },
                                { href: '/orders', label: 'My Orders' },
                                { href: '/profile/addresses', label: 'Saved Addresses' },
                                { href: '/profile/wishlist', label: 'Wishlist' },
                                { href: '/support', label: 'Support' },
                            ].map(link => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-gray-400 hover:text-green-400 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-white mb-4 text-sm">Contact</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-sm text-gray-400">
                                <Phone className="w-4 h-4 text-green-400 flex-shrink-0" />
                                +91 99999 00000
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-400">
                                <Mail className="w-4 h-4 text-green-400 flex-shrink-0" />
                                hello@sabjiwala.in
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-400">
                                <MapPin className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                Bangalore, Karnataka
                            </li>
                        </ul>
                        <div className="mt-4 p-3 bg-gray-800 rounded-xl">
                            <p className="text-xs text-gray-400 mb-1">Delivery Hours</p>
                            <p className="text-sm font-medium text-white">7:00 AM – 9:00 PM</p>
                            <p className="text-xs text-green-400">7 days a week</p>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-gray-500">
                        © 2026 Sabjiwala. All rights reserved. Made with 🌿 for fresh food lovers.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <Link href="/privacy" className="hover:text-green-400 transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-green-400 transition-colors">Terms</Link>
                        <Link href="/refund-policy" className="hover:text-green-400 transition-colors">Refund Policy</Link>
                    </div>
                </div>
            </div>

            {/* Mobile bottom padding for nav */}
            <div className="md:hidden h-16" />
        </footer>
    );
}
