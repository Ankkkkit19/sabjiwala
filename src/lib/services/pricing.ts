import getPrisma from '@/lib/prismaClient';

interface CartInputItem {
    variantId: string;
    quantity: number;
}

export async function validateAndCalculateOrder(
    itemsInput: CartInputItem[],
    couponCode?: string | null,
    pincode?: string | null
) {
    const prisma = await getPrisma();
    if (!prisma) throw new Error("Database not available");

    let subtotal = 0;
    const processedItems = [];

    // Map to handle duplicate variant requests correctly in input
    const itemMap = new Map<string, number>();
    for (const input of itemsInput) {
        if (typeof input.quantity !== 'number' || input.quantity <= 0 || !Number.isInteger(input.quantity) || input.quantity > 999) {
            throw new Error(`Invalid quantity for item ${input.variantId}`);
        }
        itemMap.set(input.variantId, (itemMap.get(input.variantId) || 0) + input.quantity);
    }

    for (const [variantId, quantity] of Array.from(itemMap.entries())) {
        const variant = await prisma.productVariant.findUnique({
            where: { id: variantId },
            include: { product: true }
        });

        if (!variant) {
            throw new Error(`Variant ${variantId} not found`);
        }

        if (!variant.isAvailable || !variant.product.isAvailable) {
            throw new Error(`${variant.product.name} is currently unavailable`);
        }

        if (variant.stock < quantity) {
            throw new Error(`Insufficient stock for ${variant.product.name}. Available: ${variant.stock}`);
        }

        const itemTotal = variant.price * quantity;
        subtotal += itemTotal;
        processedItems.push({
            productId: variant.productId,
            productVariantId: variant.id,
            name: variant.product.name,
            preparationType: variant.preparationType,
            weight: variant.weight,
            price: variant.price,
            quantity: quantity,
            total: itemTotal
        });
    }

    let couponDiscount = 0;
    let coupon = null;

    if (couponCode) {
        coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
        if (coupon && coupon.isActive && (!coupon.expiryDate || coupon.expiryDate > new Date())) {
            if (subtotal >= coupon.minimumOrder) {
                if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
                    throw new Error('Coupon usage limit reached');
                }

                if (coupon.discountType === 'PERCENTAGE') {
                    let calc = (subtotal * coupon.discountValue) / 100;
                    if (coupon.maximumDiscount && calc > coupon.maximumDiscount) {
                        calc = coupon.maximumDiscount;
                    }
                    couponDiscount = Math.round(calc * 100) / 100;
                } else if (coupon.discountType === 'FIXED') {
                    couponDiscount = coupon.discountValue;
                    if (couponDiscount > subtotal) couponDiscount = subtotal;
                }
            } else {
                throw new Error(`Minimum order of ₹${coupon.minimumOrder} required for this coupon`);
            }
        } else {
            throw new Error('Invalid or expired coupon');
        }
    }

    // Default Delivery Logic
    let deliveryFee = subtotal >= 299 ? 0 : 30;

    // Extend block for pincode based delivery zone mapping
    if (pincode) {
        const zone = await prisma.deliveryZone.findFirst({
            where: {
                isActive: true,
                pincodes: { has: pincode }
            }
        });
        if (zone) {
            deliveryFee = subtotal >= 299 ? 0 : zone.deliveryCharge;
        }
    }

    const total = subtotal - couponDiscount + deliveryFee;

    return {
        items: processedItems,
        subtotal,
        couponDiscount,
        deliveryFee,
        total,
        coupon
    };
}
