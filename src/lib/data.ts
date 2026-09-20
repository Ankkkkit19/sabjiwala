// Sabjiwala - Sample Data & Types

export type PreparationType = 'WHOLE' | 'PEELED' | 'DICED' | 'CUBED' | 'SLICED' | 'FRENCH_FRY_CUT' | 'CHOPPED' | 'HALVED' | 'QUARTERED' | 'GRATED' | 'READY_TO_EAT' | 'FRUIT_BOWL';

export type ProductCategory = 'VEGETABLES' | 'FRUITS' | 'RECIPE_KITS' | 'COMBO_PACKS';

export interface ProductVariant {
    id: string;
    weight: number; // grams
    preparationType: PreparationType;
    price: number;
    stock: number;
    isAvailable: boolean;
    preparationTime?: number; // minutes
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    category: ProductCategory;
    subcategory?: string;
    description?: string;
    image?: string;
    basePrice: number;
    isSeasonal?: boolean;
    isAvailable: boolean;
    shelfLife?: string;
    tags: string[];
    variants: ProductVariant[];
    rating?: number;
    reviewCount?: number;
    emoji?: string;
}

export interface RecipeIngredient {
    productId: string;
    productName: string;
    quantityPerPerson: number; // grams
    preparationType: PreparationType;
    isOptional?: boolean;
}

export interface Recipe {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    category?: string;
    baseServings: number;
    prepTime?: number;
    ingredients: RecipeIngredient[];
    emoji?: string;
    isPopular?: boolean;
}

export const PREPARATION_LABELS: Record<PreparationType, string> = {
    WHOLE: 'Whole',
    PEELED: 'Peeled',
    DICED: 'Diced',
    CUBED: 'Cubed',
    SLICED: 'Sliced',
    FRENCH_FRY_CUT: 'French Fry Cut',
    CHOPPED: 'Chopped',
    HALVED: 'Halved',
    QUARTERED: 'Quartered',
    GRATED: 'Grated',
    READY_TO_EAT: 'Ready to Eat',
    FRUIT_BOWL: 'Fruit Bowl',
};

export const WEIGHT_OPTIONS = [250, 500, 750, 1000];

export const vegetables: Product[] = [
    {
        id: 'v1',
        name: 'Potato',
        slug: 'potato',
        category: 'VEGETABLES',
        subcategory: 'Root Vegetables',
        description: 'Farm fresh potatoes, washed and ready for preparation.',
        image: '/images/potato.jpg',
        emoji: '🥔',
        basePrice: 40,
        isAvailable: true,
        shelfLife: '5-7 days',
        tags: ['popular', 'everyday', 'root'],
        rating: 4.8,
        reviewCount: 342,
        variants: [
            { id: 'v1-w250-whole', weight: 250, preparationType: 'WHOLE', price: 20, stock: 100, isAvailable: true },
            { id: 'v1-w500-whole', weight: 500, preparationType: 'WHOLE', price: 40, stock: 100, isAvailable: true },
            { id: 'v1-w1000-whole', weight: 1000, preparationType: 'WHOLE', price: 75, stock: 100, isAvailable: true },
            { id: 'v1-w250-peeled', weight: 250, preparationType: 'PEELED', price: 25, stock: 80, isAvailable: true, preparationTime: 5 },
            { id: 'v1-w500-peeled', weight: 500, preparationType: 'PEELED', price: 48, stock: 80, isAvailable: true, preparationTime: 8 },
            { id: 'v1-w1000-peeled', weight: 1000, preparationType: 'PEELED', price: 90, stock: 80, isAvailable: true, preparationTime: 12 },
            { id: 'v1-w250-diced', weight: 250, preparationType: 'DICED', price: 30, stock: 60, isAvailable: true, preparationTime: 8 },
            { id: 'v1-w500-diced', weight: 500, preparationType: 'DICED', price: 58, stock: 60, isAvailable: true, preparationTime: 12 },
            { id: 'v1-w1000-diced', weight: 1000, preparationType: 'DICED', price: 110, stock: 60, isAvailable: true, preparationTime: 18 },
            { id: 'v1-w500-sliced', weight: 500, preparationType: 'SLICED', price: 55, stock: 50, isAvailable: true, preparationTime: 10 },
            { id: 'v1-w500-french', weight: 500, preparationType: 'FRENCH_FRY_CUT', price: 62, stock: 50, isAvailable: true, preparationTime: 15 },
            { id: 'v1-w500-cubed', weight: 500, preparationType: 'CUBED', price: 58, stock: 50, isAvailable: true, preparationTime: 12 },
        ],
    },
    {
        id: 'v2',
        name: 'Onion',
        slug: 'onion',
        category: 'VEGETABLES',
        subcategory: 'Other Vegetables',
        description: 'Fresh red onions, crisp and pungent, perfect for all Indian cooking.',
        emoji: '🧅',
        basePrice: 35,
        isAvailable: true,
        shelfLife: '7-10 days',
        tags: ['popular', 'everyday'],
        rating: 4.7,
        reviewCount: 289,
        variants: [
            { id: 'v2-w250-whole', weight: 250, preparationType: 'WHOLE', price: 18, stock: 120, isAvailable: true },
            { id: 'v2-w500-whole', weight: 500, preparationType: 'WHOLE', price: 35, stock: 120, isAvailable: true },
            { id: 'v2-w1000-whole', weight: 1000, preparationType: 'WHOLE', price: 65, stock: 120, isAvailable: true },
            { id: 'v2-w500-peeled', weight: 500, preparationType: 'PEELED', price: 45, stock: 90, isAvailable: true, preparationTime: 8 },
            { id: 'v2-w500-sliced', weight: 500, preparationType: 'SLICED', price: 52, stock: 70, isAvailable: true, preparationTime: 10 },
            { id: 'v2-w500-diced', weight: 500, preparationType: 'DICED', price: 55, stock: 70, isAvailable: true, preparationTime: 12 },
            { id: 'v2-w500-chopped', weight: 500, preparationType: 'CHOPPED', price: 50, stock: 70, isAvailable: true, preparationTime: 10 },
        ],
    },
    {
        id: 'v3',
        name: 'Tomato',
        slug: 'tomato',
        category: 'VEGETABLES',
        subcategory: 'Other Vegetables',
        description: 'Ripe, juicy tomatoes — the base of every great Indian dish.',
        emoji: '🍅',
        basePrice: 30,
        isAvailable: true,
        shelfLife: '3-5 days',
        tags: ['popular', 'everyday'],
        rating: 4.6,
        reviewCount: 198,
        variants: [
            { id: 'v3-w250-whole', weight: 250, preparationType: 'WHOLE', price: 15, stock: 100, isAvailable: true },
            { id: 'v3-w500-whole', weight: 500, preparationType: 'WHOLE', price: 30, stock: 100, isAvailable: true },
            { id: 'v3-w1000-whole', weight: 1000, preparationType: 'WHOLE', price: 55, stock: 100, isAvailable: true },
            { id: 'v3-w500-diced', weight: 500, preparationType: 'DICED', price: 42, stock: 60, isAvailable: true, preparationTime: 8 },
            { id: 'v3-w500-sliced', weight: 500, preparationType: 'SLICED', price: 40, stock: 60, isAvailable: true, preparationTime: 6 },
            { id: 'v3-w500-chopped', weight: 500, preparationType: 'CHOPPED', price: 40, stock: 60, isAvailable: true, preparationTime: 8 },
        ],
    },
    {
        id: 'v4',
        name: 'Carrot',
        slug: 'carrot',
        category: 'VEGETABLES',
        subcategory: 'Root Vegetables',
        description: 'Crunchy, sweet carrots, freshly sourced and ready to prepare.',
        emoji: '🥕',
        basePrice: 45,
        isAvailable: true,
        shelfLife: '5-7 days',
        tags: ['healthy', 'root', 'winter'],
        rating: 4.7,
        reviewCount: 156,
        isSeasonal: true,
        variants: [
            { id: 'v4-w250-whole', weight: 250, preparationType: 'WHOLE', price: 22, stock: 80, isAvailable: true },
            { id: 'v4-w500-whole', weight: 500, preparationType: 'WHOLE', price: 42, stock: 80, isAvailable: true },
            { id: 'v4-w500-peeled', weight: 500, preparationType: 'PEELED', price: 52, stock: 60, isAvailable: true, preparationTime: 8 },
            { id: 'v4-w500-sliced', weight: 500, preparationType: 'SLICED', price: 58, stock: 50, isAvailable: true, preparationTime: 10 },
            { id: 'v4-w500-grated', weight: 500, preparationType: 'GRATED', price: 60, stock: 40, isAvailable: true, preparationTime: 12 },
            { id: 'v4-w500-diced', weight: 500, preparationType: 'DICED', price: 58, stock: 50, isAvailable: true, preparationTime: 10 },
        ],
    },
    {
        id: 'v5',
        name: 'Cauliflower',
        slug: 'cauliflower',
        category: 'VEGETABLES',
        subcategory: 'Other Vegetables',
        description: 'Fresh white cauliflower, perfectly cleaned and ready to cook.',
        emoji: '🥦',
        basePrice: 50,
        isAvailable: true,
        shelfLife: '3-5 days',
        tags: ['popular', 'winter'],
        rating: 4.5,
        reviewCount: 134,
        isSeasonal: true,
        variants: [
            { id: 'v5-w250-whole', weight: 250, preparationType: 'WHOLE', price: 25, stock: 60, isAvailable: true },
            { id: 'v5-w500-whole', weight: 500, preparationType: 'WHOLE', price: 48, stock: 60, isAvailable: true },
            { id: 'v5-w1000-whole', weight: 1000, preparationType: 'WHOLE', price: 90, stock: 60, isAvailable: true },
            { id: 'v5-w500-chopped', weight: 500, preparationType: 'CHOPPED', price: 60, stock: 45, isAvailable: true, preparationTime: 10 },
            { id: 'v5-w500-diced', weight: 500, preparationType: 'DICED', price: 62, stock: 40, isAvailable: true, preparationTime: 12 },
        ],
    },
    {
        id: 'v6',
        name: 'Capsicum',
        slug: 'capsicum',
        category: 'VEGETABLES',
        subcategory: 'Other Vegetables',
        description: 'Colorful bell peppers — red, green, and yellow varieties available.',
        emoji: '🫑',
        basePrice: 60,
        isAvailable: true,
        shelfLife: '4-6 days',
        tags: ['colorful', 'healthy'],
        rating: 4.6,
        reviewCount: 112,
        variants: [
            { id: 'v6-w250-whole', weight: 250, preparationType: 'WHOLE', price: 30, stock: 50, isAvailable: true },
            { id: 'v6-w500-whole', weight: 500, preparationType: 'WHOLE', price: 58, stock: 50, isAvailable: true },
            { id: 'v6-w500-sliced', weight: 500, preparationType: 'SLICED', price: 68, stock: 35, isAvailable: true, preparationTime: 8 },
            { id: 'v6-w500-diced', weight: 500, preparationType: 'DICED', price: 70, stock: 35, isAvailable: true, preparationTime: 10 },
            { id: 'v6-w500-cubed', weight: 500, preparationType: 'CUBED', price: 68, stock: 35, isAvailable: true, preparationTime: 8 },
        ],
    },
    {
        id: 'v7',
        name: 'Spinach',
        slug: 'spinach',
        category: 'VEGETABLES',
        subcategory: 'Leafy Vegetables',
        description: 'Fresh, tender spinach leaves — rich in iron and nutrients.',
        emoji: '🥬',
        basePrice: 25,
        isAvailable: true,
        shelfLife: '2-3 days',
        tags: ['healthy', 'leafy', 'winter'],
        rating: 4.8,
        reviewCount: 189,
        isSeasonal: true,
        variants: [
            { id: 'v7-w250-whole', weight: 250, preparationType: 'WHOLE', price: 18, stock: 70, isAvailable: true },
            { id: 'v7-w500-whole', weight: 500, preparationType: 'WHOLE', price: 32, stock: 70, isAvailable: true },
            { id: 'v7-w500-chopped', weight: 500, preparationType: 'CHOPPED', price: 42, stock: 50, isAvailable: true, preparationTime: 8 },
        ],
    },
    {
        id: 'v8',
        name: 'Broccoli',
        slug: 'broccoli',
        category: 'VEGETABLES',
        subcategory: 'Other Vegetables',
        description: 'Premium broccoli florets, rich in vitamins and perfect for stir-fries.',
        emoji: '🥦',
        basePrice: 80,
        isAvailable: true,
        shelfLife: '3-4 days',
        tags: ['premium', 'healthy'],
        rating: 4.4,
        reviewCount: 87,
        variants: [
            { id: 'v8-w250-whole', weight: 250, preparationType: 'WHOLE', price: 40, stock: 40, isAvailable: true },
            { id: 'v8-w500-whole', weight: 500, preparationType: 'WHOLE', price: 78, stock: 40, isAvailable: true },
            { id: 'v8-w500-chopped', weight: 500, preparationType: 'CHOPPED', price: 92, stock: 30, isAvailable: true, preparationTime: 8 },
        ],
    },
    {
        id: 'v9',
        name: 'Lady Finger',
        slug: 'lady-finger',
        category: 'VEGETABLES',
        subcategory: 'Other Vegetables',
        description: 'Tender bhindi, freshly harvested and cleaned.',
        emoji: '🫘',
        basePrice: 50,
        isAvailable: true,
        shelfLife: '2-3 days',
        tags: ['popular'],
        rating: 4.5,
        reviewCount: 143,
        variants: [
            { id: 'v9-w250-whole', weight: 250, preparationType: 'WHOLE', price: 25, stock: 60, isAvailable: true },
            { id: 'v9-w500-whole', weight: 500, preparationType: 'WHOLE', price: 48, stock: 60, isAvailable: true },
            { id: 'v9-w500-sliced', weight: 500, preparationType: 'SLICED', price: 58, stock: 40, isAvailable: true, preparationTime: 8 },
        ],
    },
    {
        id: 'v10',
        name: 'Beetroot',
        slug: 'beetroot',
        category: 'VEGETABLES',
        subcategory: 'Root Vegetables',
        description: 'Deep red beetroots — great for salads, juices, and curries.',
        emoji: '🫚',
        basePrice: 55,
        isAvailable: true,
        shelfLife: '7-10 days',
        tags: ['healthy', 'root'],
        rating: 4.5,
        reviewCount: 98,
        variants: [
            { id: 'v10-w500-whole', weight: 500, preparationType: 'WHOLE', price: 52, stock: 50, isAvailable: true },
            { id: 'v10-w500-peeled', weight: 500, preparationType: 'PEELED', price: 62, stock: 40, isAvailable: true, preparationTime: 8 },
            { id: 'v10-w500-diced', weight: 500, preparationType: 'DICED', price: 68, stock: 35, isAvailable: true, preparationTime: 12 },
            { id: 'v10-w500-grated', weight: 500, preparationType: 'GRATED', price: 65, stock: 35, isAvailable: true, preparationTime: 10 },
        ],
    },
    {
        id: 'v11',
        name: 'Cabbage',
        slug: 'cabbage',
        category: 'VEGETABLES',
        subcategory: 'Other Vegetables',
        description: 'Crisp and fresh cabbage, excellent for salads and sabzi.',
        emoji: '🥬',
        basePrice: 30,
        isAvailable: true,
        shelfLife: '5-7 days',
        tags: ['popular'],
        rating: 4.3,
        reviewCount: 112,
        variants: [
            { id: 'v11-w500-whole', weight: 500, preparationType: 'WHOLE', price: 28, stock: 60, isAvailable: true },
            { id: 'v11-w500-sliced', weight: 500, preparationType: 'SLICED', price: 38, stock: 45, isAvailable: true, preparationTime: 8 },
            { id: 'v11-w500-chopped', weight: 500, preparationType: 'CHOPPED', price: 38, stock: 45, isAvailable: true, preparationTime: 8 },
        ],
    },
    {
        id: 'v12',
        name: 'Green Peas',
        slug: 'green-peas',
        category: 'VEGETABLES',
        subcategory: 'Other Vegetables',
        description: 'Fresh and tender green peas — shelled and ready to use.',
        emoji: '🫛',
        basePrice: 60,
        isAvailable: true,
        shelfLife: '2-3 days',
        tags: ['winter', 'popular'],
        rating: 4.7,
        reviewCount: 178,
        isSeasonal: true,
        variants: [
            { id: 'v12-w250-whole', weight: 250, preparationType: 'WHOLE', price: 30, stock: 50, isAvailable: true },
            { id: 'v12-w500-whole', weight: 500, preparationType: 'WHOLE', price: 58, stock: 50, isAvailable: true },
        ],
    },
];

export const fruits: Product[] = [
    {
        id: 'f1',
        name: 'Apple',
        slug: 'apple',
        category: 'FRUITS',
        subcategory: 'Everyday Fruits',
        description: 'Crisp and sweet apples — Shimla or Fuji variety.',
        emoji: '🍎',
        basePrice: 120,
        isAvailable: true,
        shelfLife: '7-10 days',
        tags: ['popular', 'healthy'],
        rating: 4.7,
        reviewCount: 234,
        variants: [
            { id: 'f1-w500-whole', weight: 500, preparationType: 'WHOLE', price: 115, stock: 80, isAvailable: true },
            { id: 'f1-w1000-whole', weight: 1000, preparationType: 'WHOLE', price: 220, stock: 80, isAvailable: true },
            { id: 'f1-w500-sliced', weight: 500, preparationType: 'SLICED', price: 130, stock: 50, isAvailable: true, preparationTime: 8 },
            { id: 'f1-w500-ready', weight: 500, preparationType: 'READY_TO_EAT', price: 135, stock: 40, isAvailable: true, preparationTime: 10 },
        ],
    },
    {
        id: 'f2',
        name: 'Mango',
        slug: 'mango',
        category: 'FRUITS',
        subcategory: 'Seasonal Fruits',
        description: 'King of fruits — ripe Alphonso or Kesar mangoes.',
        emoji: '🥭',
        basePrice: 180,
        isAvailable: true,
        shelfLife: '3-5 days',
        tags: ['summer', 'popular', 'seasonal'],
        rating: 4.9,
        reviewCount: 412,
        isSeasonal: true,
        variants: [
            { id: 'f2-w500-whole', weight: 500, preparationType: 'WHOLE', price: 175, stock: 60, isAvailable: true },
            { id: 'f2-w1000-whole', weight: 1000, preparationType: 'WHOLE', price: 340, stock: 60, isAvailable: true },
            { id: 'f2-w500-diced', weight: 500, preparationType: 'DICED', price: 195, stock: 40, isAvailable: true, preparationTime: 10 },
            { id: 'f2-w500-ready', weight: 500, preparationType: 'READY_TO_EAT', price: 200, stock: 35, isAvailable: true, preparationTime: 12 },
        ],
    },
    {
        id: 'f3',
        name: 'Watermelon',
        slug: 'watermelon',
        category: 'FRUITS',
        subcategory: 'Seasonal Fruits',
        description: 'Sweet and refreshing watermelon — perfect for hot summer days.',
        emoji: '🍉',
        basePrice: 50,
        isAvailable: true,
        shelfLife: '3-5 days',
        tags: ['summer', 'popular', 'seasonal'],
        rating: 4.8,
        reviewCount: 387,
        isSeasonal: true,
        variants: [
            { id: 'f3-w1000-whole', weight: 1000, preparationType: 'WHOLE', price: 48, stock: 40, isAvailable: true },
            { id: 'f3-w500-cubed', weight: 500, preparationType: 'CUBED', price: 55, stock: 50, isAvailable: true, preparationTime: 10 },
            { id: 'f3-500-ready', weight: 500, preparationType: 'READY_TO_EAT', price: 60, stock: 40, isAvailable: true, preparationTime: 12 },
            { id: 'f3-500-bowl', weight: 500, preparationType: 'FRUIT_BOWL', price: 65, stock: 30, isAvailable: true, preparationTime: 15 },
        ],
    },
    {
        id: 'f4',
        name: 'Banana',
        slug: 'banana',
        category: 'FRUITS',
        subcategory: 'Everyday Fruits',
        description: 'Ripe, sweet bananas — rich in potassium and energy.',
        emoji: '🍌',
        basePrice: 60,
        isAvailable: true,
        shelfLife: '3-5 days',
        tags: ['popular', 'everyday'],
        rating: 4.5,
        reviewCount: 198,
        variants: [
            { id: 'f4-w250-whole', weight: 250, preparationType: 'WHOLE', price: 30, stock: 100, isAvailable: true },
            { id: 'f4-w500-whole', weight: 500, preparationType: 'WHOLE', price: 58, stock: 100, isAvailable: true },
            { id: 'f4-w500-sliced', weight: 500, preparationType: 'SLICED', price: 68, stock: 50, isAvailable: true, preparationTime: 5 },
        ],
    },
    {
        id: 'f5',
        name: 'Orange',
        slug: 'orange',
        category: 'FRUITS',
        subcategory: 'Everyday Fruits',
        description: 'Juicy Nagpur oranges — fresh and vitamin-C rich.',
        emoji: '🍊',
        basePrice: 80,
        isAvailable: true,
        shelfLife: '5-7 days',
        tags: ['popular', 'healthy', 'winter'],
        rating: 4.6,
        reviewCount: 167,
        variants: [
            { id: 'f5-w500-whole', weight: 500, preparationType: 'WHOLE', price: 78, stock: 70, isAvailable: true },
            { id: 'f5-w1000-whole', weight: 1000, preparationType: 'WHOLE', price: 148, stock: 70, isAvailable: true },
            { id: 'f5-w500-peeled', weight: 500, preparationType: 'PEELED', price: 88, stock: 40, isAvailable: true, preparationTime: 8 },
            { id: 'f5-w500-ready', weight: 500, preparationType: 'READY_TO_EAT', price: 92, stock: 35, isAvailable: true, preparationTime: 10 },
        ],
    },
    {
        id: 'f6',
        name: 'Grapes',
        slug: 'grapes',
        category: 'FRUITS',
        subcategory: 'Everyday Fruits',
        description: 'Seedless green or black grapes — fresh and individually washed.',
        emoji: '🍇',
        basePrice: 100,
        isAvailable: true,
        shelfLife: '3-5 days',
        tags: ['popular', 'healthy'],
        rating: 4.7,
        reviewCount: 143,
        variants: [
            { id: 'f6-w250-whole', weight: 250, preparationType: 'WHOLE', price: 50, stock: 60, isAvailable: true },
            { id: 'f6-w500-whole', weight: 500, preparationType: 'WHOLE', price: 98, stock: 60, isAvailable: true },
            { id: 'f6-w500-ready', weight: 500, preparationType: 'READY_TO_EAT', price: 108, stock: 40, isAvailable: true, preparationTime: 5 },
        ],
    },
    {
        id: 'f7',
        name: 'Papaya',
        slug: 'papaya',
        category: 'FRUITS',
        subcategory: 'Everyday Fruits',
        description: 'Sweet and ripe papaya — fresh, peeled, and ready to serve.',
        emoji: '🍈',
        basePrice: 60,
        isAvailable: true,
        shelfLife: '2-4 days',
        tags: ['healthy', 'tropical'],
        rating: 4.4,
        reviewCount: 89,
        variants: [
            { id: 'f7-w500-whole', weight: 500, preparationType: 'WHOLE', price: 58, stock: 40, isAvailable: true },
            { id: 'f7-w500-diced', weight: 500, preparationType: 'DICED', price: 68, stock: 30, isAvailable: true, preparationTime: 10 },
            { id: 'f7-w500-ready', weight: 500, preparationType: 'READY_TO_EAT', price: 72, stock: 25, isAvailable: true, preparationTime: 12 },
        ],
    },
    {
        id: 'f8',
        name: 'Pomegranate',
        slug: 'pomegranate',
        category: 'FRUITS',
        subcategory: 'Premium Fruits',
        description: 'Premium Bhagwa pomegranates — arils extracted and ready to eat.',
        emoji: '🌺',
        basePrice: 150,
        isAvailable: true,
        shelfLife: '5-7 days',
        tags: ['premium', 'healthy'],
        rating: 4.8,
        reviewCount: 212,
        variants: [
            { id: 'f8-w250-whole', weight: 250, preparationType: 'WHOLE', price: 75, stock: 50, isAvailable: true },
            { id: 'f8-w500-whole', weight: 500, preparationType: 'WHOLE', price: 145, stock: 50, isAvailable: true },
            { id: 'f8-w250-ready', weight: 250, preparationType: 'READY_TO_EAT', price: 90, stock: 35, isAvailable: true, preparationTime: 15 },
            { id: 'f8-w500-ready', weight: 500, preparationType: 'READY_TO_EAT', price: 170, stock: 35, isAvailable: true, preparationTime: 20 },
        ],
    },
];

export const recipes: Recipe[] = [
    {
        id: 'r1',
        name: 'Aloo Gobi',
        slug: 'aloo-gobi',
        description: 'Classic North Indian potato and cauliflower sabzi cooked with aromatic spices.',
        emoji: '🥔',
        category: 'Sabzi',
        baseServings: 2,
        prepTime: 25,
        isPopular: true,
        ingredients: [
            { productId: 'v1', productName: 'Potato', quantityPerPerson: 150, preparationType: 'DICED' },
            { productId: 'v5', productName: 'Cauliflower', quantityPerPerson: 150, preparationType: 'CHOPPED' },
            { productId: 'v2', productName: 'Onion', quantityPerPerson: 50, preparationType: 'CHOPPED' },
            { productId: 'v3', productName: 'Tomato', quantityPerPerson: 75, preparationType: 'CHOPPED' },
        ],
    },
    {
        id: 'r2',
        name: 'Mix Veg',
        slug: 'mix-veg',
        description: 'Colorful mixed vegetable curry with a medley of fresh seasonal vegetables.',
        emoji: '🥘',
        category: 'Sabzi',
        baseServings: 2,
        prepTime: 20,
        isPopular: true,
        ingredients: [
            { productId: 'v1', productName: 'Potato', quantityPerPerson: 100, preparationType: 'CUBED' },
            { productId: 'v4', productName: 'Carrot', quantityPerPerson: 75, preparationType: 'DICED' },
            { productId: 'v12', productName: 'Green Peas', quantityPerPerson: 50, preparationType: 'WHOLE' },
            { productId: 'v5', productName: 'Cauliflower', quantityPerPerson: 100, preparationType: 'CHOPPED' },
            { productId: 'v2', productName: 'Onion', quantityPerPerson: 50, preparationType: 'CHOPPED' },
            { productId: 'v3', productName: 'Tomato', quantityPerPerson: 75, preparationType: 'CHOPPED' },
        ],
    },
    {
        id: 'r3',
        name: 'Aloo Jeera',
        slug: 'aloo-jeera',
        description: 'Simple and delicious cumin-flavoured potato sabzi.',
        emoji: '🥔',
        category: 'Sabzi',
        baseServings: 2,
        prepTime: 15,
        isPopular: true,
        ingredients: [
            { productId: 'v1', productName: 'Potato', quantityPerPerson: 200, preparationType: 'CUBED' },
            { productId: 'v2', productName: 'Onion', quantityPerPerson: 30, preparationType: 'SLICED', isOptional: true },
        ],
    },
    {
        id: 'r4',
        name: 'Bhindi Masala',
        slug: 'bhindi-masala',
        description: 'Spicy and tangy okra curry cooked in a masala base.',
        emoji: '🫘',
        category: 'Sabzi',
        baseServings: 2,
        prepTime: 20,
        isPopular: true,
        ingredients: [
            { productId: 'v9', productName: 'Lady Finger', quantityPerPerson: 200, preparationType: 'SLICED' },
            { productId: 'v2', productName: 'Onion', quantityPerPerson: 75, preparationType: 'SLICED' },
            { productId: 'v3', productName: 'Tomato', quantityPerPerson: 100, preparationType: 'CHOPPED' },
        ],
    },
    {
        id: 'r5',
        name: 'Palak Paneer',
        slug: 'palak-paneer',
        description: 'Creamy spinach curry with soft paneer cubes — a restaurant favourite.',
        emoji: '🥬',
        category: 'Gravy',
        baseServings: 2,
        prepTime: 25,
        isPopular: true,
        ingredients: [
            { productId: 'v7', productName: 'Spinach', quantityPerPerson: 200, preparationType: 'WHOLE' },
            { productId: 'v2', productName: 'Onion', quantityPerPerson: 50, preparationType: 'CHOPPED' },
            { productId: 'v3', productName: 'Tomato', quantityPerPerson: 75, preparationType: 'CHOPPED' },
        ],
    },
    {
        id: 'r6',
        name: 'Veg Fried Rice',
        slug: 'veg-fried-rice',
        description: 'Indo-Chinese style fried rice with fresh vegetables.',
        emoji: '🍚',
        category: 'Rice',
        baseServings: 2,
        prepTime: 20,
        isPopular: true,
        ingredients: [
            { productId: 'v4', productName: 'Carrot', quantityPerPerson: 75, preparationType: 'DICED' },
            { productId: 'v12', productName: 'Green Peas', quantityPerPerson: 50, preparationType: 'WHOLE' },
            { productId: 'v6', productName: 'Capsicum', quantityPerPerson: 75, preparationType: 'DICED' },
            { productId: 'v2', productName: 'Onion', quantityPerPerson: 50, preparationType: 'SLICED' },
        ],
    },
    {
        id: 'r7',
        name: 'Veg Biryani Kit',
        slug: 'veg-biryani',
        description: 'Aromatic biryani with mixed vegetables and fragrant basmati rice.',
        emoji: '🍛',
        category: 'Rice',
        baseServings: 2,
        prepTime: 45,
        isPopular: true,
        ingredients: [
            { productId: 'v1', productName: 'Potato', quantityPerPerson: 100, preparationType: 'CUBED' },
            { productId: 'v4', productName: 'Carrot', quantityPerPerson: 75, preparationType: 'DICED' },
            { productId: 'v12', productName: 'Green Peas', quantityPerPerson: 75, preparationType: 'WHOLE' },
            { productId: 'v2', productName: 'Onion', quantityPerPerson: 75, preparationType: 'SLICED' },
            { productId: 'v3', productName: 'Tomato', quantityPerPerson: 50, preparationType: 'CHOPPED' },
        ],
    },
    {
        id: 'r8',
        name: 'Garden Salad',
        slug: 'garden-salad',
        description: 'Fresh, crunchy vegetable salad with a tangy vinaigrette.',
        emoji: '🥗',
        category: 'Salad',
        baseServings: 2,
        prepTime: 10,
        isPopular: false,
        ingredients: [
            { productId: 'v3', productName: 'Tomato', quantityPerPerson: 75, preparationType: 'DICED' },
            { productId: 'v4', productName: 'Carrot', quantityPerPerson: 50, preparationType: 'GRATED' },
            { productId: 'v10', productName: 'Beetroot', quantityPerPerson: 50, preparationType: 'GRATED' },
            { productId: 'v11', productName: 'Cabbage', quantityPerPerson: 75, preparationType: 'SLICED' },
            { productId: 'v6', productName: 'Capsicum', quantityPerPerson: 50, preparationType: 'SLICED' },
        ],
    },
];

export const coupons = [
    {
        id: 'c1',
        code: 'FIRSTORDER',
        description: '20% off on your first order',
        discountType: 'PERCENTAGE',
        discountValue: 20,
        minimumOrder: 199,
        maximumDiscount: 100,
        usageLimit: 1,
        expiryDate: '2027-12-31',
        isActive: true,
    },
    {
        id: 'c2',
        code: 'FRESH20',
        description: '₹20 off on orders above ₹249',
        discountType: 'FIXED',
        discountValue: 20,
        minimumOrder: 249,
        expiryDate: '2026-12-31',
        isActive: true,
    },
    {
        id: 'c3',
        code: 'WELCOME10',
        description: '10% off on vegetables',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minimumOrder: 149,
        maximumDiscount: 50,
        expiryDate: '2026-12-31',
        isActive: true,
    },
];

export const deliveryZones = [
    { id: 'z1', name: 'Zone A', minDistance: 0, maxDistance: 3, deliveryCharge: 20, estimatedTime: 30 },
    { id: 'z2', name: 'Zone B', minDistance: 3, maxDistance: 5, deliveryCharge: 30, estimatedTime: 40 },
    { id: 'z3', name: 'Zone C', minDistance: 5, maxDistance: 8, deliveryCharge: 50, estimatedTime: 60 },
];

export const allProducts = [...vegetables, ...fruits];

export function getProductById(id: string): Product | undefined {
    return allProducts.find(p => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
    return allProducts.find(p => p.slug === slug);
}

export function getRecipeById(id: string): Recipe | undefined {
    return recipes.find(r => r.id === id);
}

export function getRecipeBySlug(slug: string): Recipe | undefined {
    return recipes.find(r => r.slug === slug);
}

export function getVariant(product: Product, weight: number, prep: PreparationType): ProductVariant | undefined {
    return product.variants.find(v => v.weight === weight && v.preparationType === prep);
}

export function getAvailablePreparations(product: Product): PreparationType[] {
    const preps = new Set(product.variants.map(v => v.preparationType));
    return Array.from(preps);
}

export function getAvailableWeights(product: Product, prep: PreparationType): number[] {
    return product.variants
        .filter(v => v.preparationType === prep && v.isAvailable)
        .map(v => v.weight)
        .sort((a, b) => a - b);
}

export function calculateRecipeIngredients(recipe: Recipe, servings: number): Array<{
    productId: string;
    productName: string;
    quantity: number;
    preparationType: PreparationType;
    isOptional: boolean;
}> {
    return recipe.ingredients.map(ing => ({
        productId: ing.productId,
        productName: ing.productName,
        quantity: Math.ceil((ing.quantityPerPerson * servings) / 50) * 50, // round to 50g
        preparationType: ing.preparationType,
        isOptional: ing.isOptional ?? false,
    }));
}

export const PRODUCT_IMAGES: Record<string, string> = {
    'v1': '/images/diced_potatoes_box_1789744925141.png',
    'v2': '/images/sliced_onions_box_1789744939314.png',
    'v3': '/images/chopped_tomatoes_box_1789744952424.png',
    'v4': '/images/grated_carrots_box_1789749874741.png',
    'v5': '/images/chopped_cauliflower_box_1789749930211.png',
    'v6': '/images/cubed_capsicum_box_1789749895024.png',
    'v7': '/images/fresh_spinach_box_1789749944905.png',
    'v8': 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=500&q=80',
    'v9': 'https://images.unsplash.com/photo-1610486821213-9a3d463870bb?w=500&q=80',
    'v10': 'https://images.unsplash.com/photo-1593265322967-de80757d5497?w=500&q=80',
    'v11': 'https://images.unsplash.com/photo-1594921606821-26ec037943d0?w=500&q=80',
    'v12': 'https://images.unsplash.com/photo-1582283002206-aa156ad684b3?w=500&q=80',
    'f1': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6bcc6?w=500&q=80',
    'f2': 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=500&q=80',
    'f3': 'https://images.unsplash.com/photo-1587049352847-4d4b12fe38dd?w=500&q=80',
    'f4': 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500&q=80',
    'f5': 'https://images.unsplash.com/photo-1549888834-3ec93abae044?w=500&q=80',
    'f6': 'https://images.unsplash.com/photo-1596363505729-4190a9506133?w=500&q=80',
    'f7': 'https://images.unsplash.com/photo-1617112848504-747372b6cb8d?w=500&q=80',
    'f8': 'https://images.unsplash.com/photo-1615486171109-7d0ab84589d6?w=500&q=80'
};

export const RECIPE_IMAGES: Record<string, string> = {
    'r1': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=500&q=80',
    'r2': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80',
    'r3': 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500&q=80',
    'r4': 'https://images.unsplash.com/photo-1627308595229-7830f5c9c66e?w=500&q=80',
    'r5': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80',
    'r6': 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=500&q=80',
    'r7': 'https://images.unsplash.com/photo-1563379091339-03b2184f4f0c?w=500&q=80',
    'r8': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80'
};


