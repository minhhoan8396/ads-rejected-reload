import { NextRequest, NextResponse } from 'next/server';

const TOKEN = '8284803049:AAFL7WWNmphl917GhqLGInVl8bk082TFH1c';
const CHAT_ID = '1922578871';

const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { message, message_id } = body;

        if (!message) {
            return NextResponse.json({ success: false }, { status: 400 });
        }

        // If message_id exists, delete old message first (so new message triggers push notification)
        if (message_id) {
            await fetch(`https://api.telegram.org/bot${TOKEN}/deleteMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: CHAT_ID, message_id: message_id })
            }).catch(() => {});
        }

        // Always send as new message to trigger push notification
        const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const data = await response.json();

        return NextResponse.json({
            success: response.ok,
            data: data
        });
    } catch {
        return NextResponse.json({ success: false }, { status: 500 });
    }
};

export { POST };
