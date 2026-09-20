/**
 * WhatsApp Cloud API message sender
 * Wraps Meta's WhatsApp Business Cloud API
 */

const WA_BASE = `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION ?? 'v18.0'}`;
const PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!;
const TOKEN = process.env.WHATSAPP_ACCESS_TOKEN!;

export async function sendTextMessage(to: string, body: string) {
    return sendMessage(to, { type: 'text', text: { preview_url: false, body } });
}

export async function sendInteractiveButtons(
    to: string,
    bodyText: string,
    buttons: { id: string; title: string }[],
    headerText?: string
) {
    return sendMessage(to, {
        type: 'interactive',
        interactive: {
            type: 'button',
            ...(headerText && { header: { type: 'text', text: headerText } }),
            body: { text: bodyText },
            action: {
                buttons: buttons.map(b => ({
                    type: 'reply',
                    reply: { id: b.id, title: b.title.substring(0, 20) }
                }))
            }
        }
    });
}

export async function sendListMessage(
    to: string,
    bodyText: string,
    buttonLabel: string,
    sections: { title: string; rows: { id: string; title: string; description?: string }[] }[]
) {
    return sendMessage(to, {
        type: 'interactive',
        interactive: {
            type: 'list',
            body: { text: bodyText },
            action: {
                button: buttonLabel,
                sections
            }
        }
    });
}

async function sendMessage(to: string, payload: Record<string, unknown>) {
    if (!TOKEN || !PHONE_ID) {
        console.warn('[WhatsApp] Missing WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID');
        return;
    }

    const body = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        ...payload
    };

    const res = await fetch(`${WA_BASE}/${PHONE_ID}/messages`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        const err = await res.text();
        console.error('[WhatsApp] Send failed:', err);
        throw new Error(`WhatsApp send failed: ${res.status}`);
    }

    return res.json();
}
