/**
 * Recipe handler — uses same recipe engine as website
 */

import { sendTextMessage, sendInteractiveButtons } from '../sendMessage';
import { updateSession } from '../sessionManager';
import { recipes, calculateRecipeIngredients, getProductById, PREPARATION_LABELS, PreparationType } from '@/lib/data';
import { formatWeight } from '@/lib/utils';

export async function handleRecipe(phone: string, dish: string, servings: number) {
    // Find matching recipe - fuzzy match
    const recipe = recipes.find(r =>
        r.name.toLowerCase().includes(dish.toLowerCase()) ||
        dish.toLowerCase().includes(r.name.toLowerCase().split(' ')[0])
    );

    if (!recipe) {
        const recipeList = recipes.slice(0, 8).map(r => `• ${r.emoji} ${r.name}`).join('\n');
        await sendTextMessage(phone,
            `Sorry, I couldn't find a recipe for *"${dish}"*.\n\nAvailable recipes:\n${recipeList}\n\nTry one of these!`
        );
        return;
    }

    const ingredients = calculateRecipeIngredients(recipe, servings);
    const total = ingredients.reduce((sum, ing) => {
        const product = getProductById(ing.productId);
        if (!product) return sum;
        const variant = product.variants.find(v =>
            v.preparationType === ing.preparationType && v.isAvailable
        ) ?? product.variants.find(v => v.isAvailable);
        return sum + (variant?.price ?? 0);
    }, 0);

    const ingredientLines = ingredients.map(ing => {
        const product = getProductById(ing.productId);
        return `${product?.emoji ?? '🥬'} *${ing.productName}*\n   ${formatWeight(ing.quantity)} • ${PREPARATION_LABELS[ing.preparationType]}`;
    }).join('\n\n');

    // Store pending recipe cart
    const pendingItems = ingredients.map(ing => {
        const product = getProductById(ing.productId);
        const variant = product?.variants.find(v =>
            v.preparationType === ing.preparationType && v.isAvailable
        ) ?? product?.variants.find(v => v.isAvailable);
        return {
            productId: ing.productId,
            productName: ing.productName,
            emoji: product?.emoji ?? '🥬',
            variantId: variant ? `${ing.productId}_${variant.preparationType}_${variant.weight}` : null,
            preparationType: ing.preparationType,
            weight: ing.quantity,
            price: variant?.price ?? 0,
            quantity: 1
        };
    }).filter(i => i.variantId);

    await updateSession(phone, {
        state: 'AWAITING_RECIPE_CONFIRM',
        pendingItems,
    });

    await sendInteractiveButtons(
        phone,
        `${recipe.emoji} *${recipe.name}*\n_For ${servings} people_\n\n*Ingredients:*\n\n${ingredientLines}\n\n*Estimated Total: ₹${Math.round(total)}*`,
        [
            { id: 'add_to_cart_confirm', title: '🛒 Add All to Cart' },
            { id: 'cancel_order', title: '❌ Cancel' },
        ]
    );
}
