import { upgradeUser } from "@/app/components/backend/database";
import paddle from "@/app/components/backend/paddle";
import { EventName } from "@paddle/paddle-node-sdk";
import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

interface CustomData {
    userId: string;
}

export async function POST(request: Request) {
    const signature = request.headers.get("paddle-signature") || "";
    const rawRequestBody = await request.text();
    const secretKey = process.env["PADDLE_WEBHOOK_SECRET"] || "";

    try {
        if (signature && rawRequestBody) {
            const event = paddle.webhooks.unmarshal(rawRequestBody, secretKey, signature);
            if (!event) return NextResponse.json({}, { status: 403 });

            if (event.eventType === EventName.TransactionPaid && event.data.customData) {
                upgradeUser((event.data.customData as CustomData).userId, event.data.subscriptionId as string);
            }

            return NextResponse.json({}, { status: 200 });
        } else {
            console.log('Signature missing in header');
        }
    } catch (e) {
        Sentry.captureException(e);
    }
    return NextResponse.json({}, {
        status: 403
    });
}