import prisma from "@/utils/db";
import { sub } from "date-fns";
import Stripe from "stripe";
import { Frequency, Plan, Status } from "@prisma/client";
import { plans } from "@/utils/plans";

const stripe  = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const stripeService = {

    /**
     * Creates a new Stripe Customer object for the given user details.
     *
     * @param {Object} params - The customer details.
     * @param {string} params.name - Full name of the customer.
     * @param {string} params.email - Email address of the customer.
     *
     * @returns {Promise<{ success: boolean; customer: Stripe.Customer }>} 
     *          A success flag and the created Stripe Customer object.
     *
     * @throws {Error} If the customer creation fails.
     */
    async createCustomerAcc({name, email} : {name: string, email: string}){
        try{
            const customer = await stripe.customers.create({
                name,
                email
            });

            if(!customer){
                throw new Error("Error while creating customer");
            }

            return({
                success: true,
                customer
            });
        }
        catch(err: any){
            console.error("stripe service error", err.message);
            throw new Error(err.message);
        }
        
    },
    
    /**
     * Creates a new Stripe Checkout Session for a subscription purchase.
     *
     * @param {Object} params - The session details.
     * @param {string} params.stripe_customer_id - Existing Stripe customer ID.
     * @param {string} params.price_id - Stripe Price ID for the subscription plan.
     *
     * @returns {Promise<{ success: boolean; url: string }>} 
     *          A success flag and the hosted checkout session URL.
     *
     * @throws {Error} If the checkout session creation fails.
     */
    async createCheckoutSession({stripe_customer_id, price_id} : { stripe_customer_id : string, price_id: string}) {
        try{
            const session = await stripe.checkout.sessions.create({
                mode: 'subscription',
                customer: stripe_customer_id,
                line_items: [
                  {
                    price: price_id,
                    quantity: 1,
                  },
                ],
                currency: "USD",
                billing_address_collection : "auto",
                subscription_data : {
                    trial_period_days: 14
                },
                success_url: `${process.env.BASE_URL}/app/dashboard?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.BASE_URL}`
            });
    
            if(!session){
                throw new Error("Unable to create session") 
            }
    
            return({
                success: true,
                url: session.url
            })
        }
        catch(err : any){
            console.error("stripe service error", err.message);
            throw new Error(err.message) 
        }
    },

    /**
     * Creates a Stripe Billing Portal Session to allow customers to manage their subscription.
     *
     * @param {Object} params - The portal session details.
     * @param {string} params.stripe_customer_id - Existing Stripe customer ID.
     *
     * @returns {Promise<{ success: boolean; url: string }>} 
     *          A success flag and the hosted billing portal URL.
     *
     * @throws {Error} If the portal session creation fails.
     */
    async createPortalSession({stripe_customer_id} : {stripe_customer_id : string}){
        try{
            const session = await stripe.billingPortal.sessions.create({
                customer: stripe_customer_id,
                return_url : `${process.env.BASE_URL}/app/dashboard`
            })

            if(!session){
                throw new Error("unable to create portal session");
            }

            return({
                success: true,
                url: session.url
            })
        }
        catch(err: any){
            console.error("stripe service error", err.message);
            throw new Error(err.message);
        }
    },

    // checkout.session.completed
    async handleSessionComplete( event : Stripe.CheckoutSessionCompletedEvent){
        const stripe_customer_id = typeof event.data.object.customer === "string" 
            ? event.data.object.customer 
            : event.data.object.customer?.id
        const subscription_id = typeof event.data.object.subscription === "string" 
            ? event.data.object.subscription 
            : event.data.object.subscription?.id

        if(!stripe_customer_id || !subscription_id){
            throw new Error("Missing required fields");
        }

        const user = await prisma.user.findUnique({
            where: {
                stripe_customer_id
            }
        });

        if(!user){
            throw new Error("Unable to fetch user");
        }

        const subscription = await stripe.subscriptions.retrieve(subscription_id);
        if(!subscription){
            throw new Error("Error retrieving subscription from stripe");
        }
        if(subscription.status !== "active" && subscription.status !== "trialing"){
            throw new Error("Subscription is not active or trialing");
        }

        const item = subscription.items.data[0];
        const price = item?.price;
        const priceId = price?.id;
        const interval = price?.recurring?.interval; // 'month' | 'year'

        if(!priceId || !interval){
            throw new Error("Missing price information on subscription");
        }

        // Map priceId to our plan name
        const mapPriceToPlan = (pid: string): Plan | null => {
            if (plans.basic.monthly.price_id === pid || plans.basic.yearly.price_id === pid) return Plan.BASIC;
            if (plans.plus.monthly.price_id === pid || plans.plus.yearly.price_id === pid) return Plan.PLUS;
            if (plans.premium.monthly.price_id === pid || plans.premium.yearly.price_id === pid) return Plan.PREMIUM;
            return null;
        };

        const plan = mapPriceToPlan(priceId);
        if(!plan){
            throw new Error("Unrecognized price id for mapping to plan");
        }
        const frequency: Frequency = interval === "month" ? Frequency.MONTHLY : Frequency.YEARLY;
        const status: Status = subscription.status === "trialing" ? Status.TRAIL : Status.PAID;

        await prisma.subscription.upsert({
            where: { userId: user.id },
            update: {
                stripe_sub_id: subscription.id,
                plan,
                frequency,
                Status: status,
            },
            create: {
                userId: user.id,
                stripe_sub_id: subscription.id,
                plan,
                frequency,
                Status: status,
            }
        });

        return({
            success : true,
            subscription
        });

    },

    // invoice.paid
    async handleinvoicePaid( event : Stripe.InvoicePaidEvent){
        const data = event.data.object;
        const stripe_customer_id = typeof data.customer === "string" ? data.customer : data.customer?.id

        if(!stripe_customer_id){
            throw new Error("No stripe_customer_id found");
        }
        const user = await prisma.user.findUnique({ where: { stripe_customer_id } });
        if(!user){
            throw new Error("User not found for stripe customer");
        }
        // Mark subscription as paid (active billing)
        await prisma.subscription.update({
            where: { userId: user.id },
            data: { Status: Status.PAID }
        });
    },

    // invoice.payment_failed
    async handleinvoiceFailed( event : Stripe.InvoicePaymentFailedEvent){
        const data = event.data.object;
        const stripe_customer_id = typeof data.customer === "string" ? data.customer : data.customer?.id

        if(!stripe_customer_id){
            throw new Error("No stripe_customer_id found");
        }
        const user = await prisma.user.findUnique({ where: { stripe_customer_id } });
        if(!user){
            throw new Error("User not found for stripe customer");
        }
        // Keep subscription but leave status as-is; optionally could downgrade or mark ended later
        // No-op update to ensure record exists
        await prisma.subscription.findUnique({ where: { userId: user.id } });
    },

    // customer.subscription.updated
    async handleSubscriptionUpdate( event : Stripe.CustomerSubscriptionUpdatedEvent){
        const data = event.data.object;
        const stripe_customer_id = typeof data.customer === "string" ? data.customer : data.customer?.id

        if(!stripe_customer_id){
            throw new Error("No stripe_customer_id found");
        }
        const user = await prisma.user.findUnique({ where: { stripe_customer_id } });
        if(!user){
            throw new Error("User not found for stripe customer");
        }

        // Re-map plan/frequency from updated subscription
        const item = data.items.data[0];
        const priceId = item?.price?.id;
        const interval = item?.price?.recurring?.interval;
        const status: Status = data.status === "trialing" ? Status.TRAIL : data.status === "active" ? Status.PAID : Status.ENDED;

        let planToSet: Plan | undefined;
        if(priceId){
            if (plans.basic.monthly.price_id === priceId || plans.basic.yearly.price_id === priceId) planToSet = Plan.BASIC;
            if (plans.plus.monthly.price_id === priceId || plans.plus.yearly.price_id === priceId) planToSet = Plan.PLUS;
            if (plans.premium.monthly.price_id === priceId || plans.premium.yearly.price_id === priceId) planToSet = Plan.PREMIUM;
        }
        const dataUpdate: any = { Status: status, stripe_sub_id: data.id };
        if(planToSet) dataUpdate.plan = planToSet;
        if(interval) dataUpdate.frequency = interval === "month" ? Frequency.MONTHLY : Frequency.YEARLY;

        await prisma.subscription.update({
            where: { userId: user.id },
            data: dataUpdate
        });
    },

    // customer.subscription.deleted
    async handleSubscriptionDeleted( event : Stripe.CustomerSubscriptionDeletedEvent){
        const data = event.data.object;
        const stripe_customer_id = typeof data.customer === "string" ? data.customer : data.customer?.id

        if(!stripe_customer_id){
            throw new Error("No stripe_customer_id found");
        }
        const user = await prisma.user.findUnique({ where: { stripe_customer_id } });
        if(!user){
            throw new Error("User not found for stripe customer");
        }
        await prisma.subscription.update({
            where: { userId: user.id },
            data: { Status: Status.ENDED }
        });
    }
}



