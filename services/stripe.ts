import prisma from "@/utils/db";
import Stripe from "stripe";

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
                success_url: `${process.env.BASE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
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
                return_url : `${process.env.BASE_URL}/dashboard`
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
    async handleSessionComplete({ object } : Stripe.CheckoutSessionCompletedEvent.Data){
        const stripe_customer_id = object.customer?.toString() ;
        const subscription_id = object.subscription?.toString();

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

        const subscription : Stripe.Subscription = await stripe.subscriptions.retrieve(subscription_id);
        if(!subscription){
            throw new Error("Error retrieving subscription from stripe");
        }

        return({
            subscription
        })

    },

    // invoice.paid
    async handleinvoicePaid(){

    },

    // invoice.payment_failed
    async handleinvoiceFailed(){

    },

    // customer.subscription.updated
    async handleSubscriptionUpdate(){

    },

    // customer.subscription.deleted
    async handleSubscriptionDeleted(){

    }
}




