import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductVariant, PreparationType } from './data';

export interface CartItem {
    id: string; // unique: productId-variantId
    productId: string;
    productName: string;
    productEmoji: string;
    variantId: string;
    weight: number;
    preparationType: PreparationType;
    price: number;
    quantity: number;
    image?: string;
}

export interface CartState {
    items: CartItem[];
    couponCode: string;
    couponDiscount: number;
    deliveryFee: number;
    addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    applyCoupon: (code: string, discount: number) => void;
    removeCoupon: () => void;
    setDeliveryFee: (fee: number) => void;
    getSubtotal: () => number;
    getTotal: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            couponCode: '',
            couponDiscount: 0,
            deliveryFee: 30,

            addItem: (product: Product, variant: ProductVariant, quantity = 1) => {
                const itemId = `${product.id}-${variant.id}`;
                const existing = get().items.find(i => i.id === itemId);

                if (existing) {
                    set(state => ({
                        items: state.items.map(i =>
                            i.id === itemId ? { ...i, quantity: i.quantity + quantity } : i
                        ),
                    }));
                } else {
                    const newItem: CartItem = {
                        id: itemId,
                        productId: product.id,
                        productName: product.name,
                        productEmoji: product.emoji ?? '🥦',
                        variantId: variant.id,
                        weight: variant.weight,
                        preparationType: variant.preparationType,
                        price: variant.price,
                        quantity,
                        image: product.image,
                    };
                    set(state => ({ items: [...state.items, newItem] }));
                }
            },

            removeItem: (itemId: string) => {
                set(state => ({ items: state.items.filter(i => i.id !== itemId) }));
            },

            updateQuantity: (itemId: string, quantity: number) => {
                if (quantity <= 0) {
                    get().removeItem(itemId);
                    return;
                }
                set(state => ({
                    items: state.items.map(i => (i.id === itemId ? { ...i, quantity } : i)),
                }));
            },

            clearCart: () => {
                set({ items: [], couponCode: '', couponDiscount: 0 });
            },

            applyCoupon: (code: string, discount: number) => {
                set({ couponCode: code, couponDiscount: discount });
            },

            removeCoupon: () => {
                set({ couponCode: '', couponDiscount: 0 });
            },

            setDeliveryFee: (fee: number) => {
                set({ deliveryFee: fee });
            },

            getSubtotal: () => {
                return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            },

            getTotal: () => {
                const subtotal = get().getSubtotal();
                const { couponDiscount, deliveryFee } = get();
                return Math.max(0, subtotal + deliveryFee - couponDiscount);
            },

            getItemCount: () => {
                return get().items.reduce((count, item) => count + item.quantity, 0);
            },
        }),
        {
            name: 'freshcut-cart',
        }
    )
);

// Auth store
export interface User {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    role: 'CUSTOMER' | 'ADMIN';
}

export interface AuthState {
    user: User | null;
    isLoggedIn: boolean;
    login: (user: User) => void;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isLoggedIn: false,

            login: (user: User) => {
                set({ user, isLoggedIn: true });
            },

            logout: () => {
                set({ user: null, isLoggedIn: false });
            },

            updateUser: (updates: Partial<User>) => {
                set(state => ({
                    user: state.user ? { ...state.user, ...updates } : null,
                }));
            },
        }),
        {
            name: 'freshcut-auth',
        }
    )
);

// Wishlist store
export interface WishlistState {
    items: string[]; // product IDs
    toggle: (productId: string) => void;
    isWishlisted: (productId: string) => boolean;
    clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],

            toggle: (productId: string) => {
                const { items } = get();
                if (items.includes(productId)) {
                    set({ items: items.filter(id => id !== productId) });
                } else {
                    set({ items: [...items, productId] });
                }
            },

            isWishlisted: (productId: string) => {
                return get().items.includes(productId);
            },

            clear: () => set({ items: [] }),
        }),
        {
            name: 'freshcut-wishlist',
        }
    )
);
