import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
  typescript: true,
});

export const PRICES = {
  pro_monthly: "price_1234567890", // заменить реальным ID цены в Stripe
};

export async function createCheckoutSession(userId: string, priceId: string, credits: number) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: {
      user_id: userId,
      credits: credits.toString(),
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?payment=cancelled`,
  });
  return session.url!;
}