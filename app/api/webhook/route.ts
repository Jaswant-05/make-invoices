import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripeService } from "@/services/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get("stripe-signature");
        if (!signature) {
            return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
        }

        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
        } catch (err: any) {
            return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
        }

        switch (event.type) {
            case "checkout.session.completed": {
                await stripeService.handleSessionComplete(event as Stripe.CheckoutSessionCompletedEvent);
                break;
            }
            case "invoice.paid": {
                await stripeService.handleinvoicePaid(event as Stripe.InvoicePaidEvent);
                break;
            }
            case "invoice.payment_failed": {
                await stripeService.handleinvoiceFailed(event as Stripe.InvoicePaymentFailedEvent);
                break;
            }
            case "customer.subscription.updated": {
                await stripeService.handleSubscriptionUpdate(event as Stripe.CustomerSubscriptionUpdatedEvent);
                break;
            }
            case "customer.subscription.deleted": {
                await stripeService.handleSubscriptionDeleted(event as Stripe.CustomerSubscriptionDeletedEvent);
                break;
            }
            default: {
                // Ignore other events for now
                break;
            }
        }

        return NextResponse.json({ received: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message ?? "Internal error" }, { status: 500 });
    }
}