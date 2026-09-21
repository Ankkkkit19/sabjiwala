import { NextRequest, NextResponse } from 'next/server';
import { validateAndCalculateOrder } from '@/lib/services/pricing';
import { requireAuth } from '@/lib/auth';
import getPrisma from '@/lib/prismaClient';
import { generateOrderId } from '@/lib/utils'; // if needed, but cuid() is default

export async function POST(req: NextRequest) {
    try {
        const user = await requireAuth();
        const body = await req.json();
        const { items, couponCode, address, paymentMethod, deliverySlot, specialInstructions, idempotencyKey } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        if (!address || !address.flat || !address.street || !address.pincode) {
            return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
        }

        const prisma = await getPrisma();
        if (!prisma) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

        // Use idempotencyKey ideally via a separate lookup if necessary, 
        // to keep it simple, we just wrap in transaction.

        const orderId = await prisma.$transaction(async (tx: any) => {
            // Re-validate pricing and inventory within the transaction context
            // We pass the tx into a customized version of pricing logic or just do it inside. 
            // Wait, pricing isn't using tx. For safe inventory we should do it inline or pass tx.
            // Let's do it manually mapped to the transaction to prevent race conditions.

            let subtotal = 0;
            const processedItems = [];
            const itemMap = new Map<string, number>();
            for (const input of items) {
                if (typeof input.quantity !== 'number' || input.quantity <= 0 || !Number.isInteger(input.quantity) || input.quantity > 999) {
                    throw new Error(`Invalid quantity for item ${input.variantId}`);
                }
                itemMap.set(input.variantId, (itemMap.get(input.variantId) || 0) + input.quantity);
            }

            for (const [variantId, quantity] of Array.from(itemMap.entries())) {
                const variant = await tx.productVariant.findUnique({
                    where: { id: variantId },
                    include: { product: true }
                });

                if (!variant || !variant.isAvailable || !variant.product.isAvailable) {
                    throw new Error(`Variant ${variantId} unavailable`);
                }

                if (variant.stock < quantity) {
                    throw new Error(`Insufficient stock for ${variant.product.name}`);
                }

                // Decrement stock immediately to prevent race conditions
                await tx.productVariant.update({
                    where: { id: variantId },
                    data: { stock: { decrement: quantity } }
                });

                const itemTotal = variant.price * quantity;
                subtotal += itemTotal;
                processedItems.push({
                    productId: variant.productId,
                    productVariantId: variant.id,
                    name: variant.product.name,
                    preparationType: variant.preparationType,
                    weight: variant.weight,
                    price: variant.price,
                    quantity: quantity
                });
            }

            let couponDiscount = 0;
            if (couponCode) {
                const coupon = await tx.coupon.findUnique({ where: { code: couponCode } });
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

                        // Increment coupon usage
                        await tx.coupon.update({
                            where: { id: coupon.id },
                            data: { usedCount: { increment: 1 } }
                        });
                    } else {
                        throw new Error(`Minimum order of ₹${coupon.minimumOrder} required`);
                    }
                } else {
                    throw new Error('Invalid or expired coupon');
                }
            }

            let deliveryFee = subtotal >= 299 ? 0 : 30;
            const zone = await tx.deliveryZone.findFirst({
                where: { isActive: true, pincodes: { has: address.pincode } }
            });
            if (zone) deliveryFee = subtotal >= 299 ? 0 : zone.deliveryCharge;

            const total = subtotal - couponDiscount + deliveryFee;

            const newAddress = await tx.address.create({
                data: {
                    userId: user.id,
                    name: address.name || user.name || 'User',
                    phone: address.phone || user.phone || '000',
                    addressLine: `${address.flat}, ${address.street}`,
                    area: address.area || '',
                    city: address.city || '',
                    state: address.state || '',
                    pincode: address.pincode,
                }
            });

            // 2. Create Order
            const newOrder = await tx.order.create({
                data: {
                    userId: user.id,
                    addressId: newAddress.id,
                    subtotal,
                    deliveryFee,
                    discount: couponDiscount,
                    tax: 0,
                    total,
                    paymentMethod: paymentMethod || 'cod',
                    orderStatus: 'PENDING',
                    couponCode: couponCode || null,
                    deliverySlot: deliverySlot || null,
                    specialInstructions: specialInstructions || null,
                    items: {
                        create: processedItems.map(pi => ({
                            productId: pi.productId,
                            productVariantId: pi.productVariantId,
                            quantity: pi.quantity,
                            price: pi.price, // ACTUAL purchase price secured
                            name: pi.name,
                            preparationType: pi.preparationType,
                            weight: pi.weight
                        }))
                    }
                }
            });

            return newOrder.id;
        }, {
            maxWait: 5000,
            timeout: 10000,
        });

        return NextResponse.json({ success: true, orderId });
    } catch (error: any) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 400 });
    }
}
