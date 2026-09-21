import { NextRequest, NextResponse } from 'next/server';
import { validateAndCalculateOrder } from '@/lib/services/pricing';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { items, couponCode, pincode } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        const summary = await validateAndCalculateOrder(items, couponCode, pincode);

        // Remove the sensitive coupon object before sending to client
        const safeSummary = {
            ...summary,
            coupon: undefined
        };

        return NextResponse.json(safeSummary);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 400 });
    }
}
