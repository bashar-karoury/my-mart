import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51RBBO9QxixTjVLquHJuWRiJiqQ6Jz1iDg6qWzzWlnsNcHNUqdh3H3JekZerT0STTxbZ4XOxVw21xPXBYpLi8G2aC00ZMsgXxvK"
);
console.log("running");

export async function createSession(accountId: string) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"], // Payment methods supported
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Handmade Craft", // Product name
          },
          unit_amount: 500000, // Price in cents ($50.00)
        },
        quantity: 1, // Quantity
      },
    ],
    mode: "payment", // One-time payment
    success_url: "https://your-website.com/success", // Redirect URL after success
    cancel_url: "https://your-website.com/cancel", // Redirect URL if canceled
    payment_intent_data: {
      application_fee_amount: 500, // Your platform's fee (e.g., $5.00)
      transfer_data: {
        destination: accountId, // Seller's Stripe account ID
      },
    },
  });

  console.log(session.url); // Redirect the customer to this URL
  return session.url;
}
export async function createAccount(email: string) {
  const account = await stripe.accounts.create({
    type: "express",
    country: "US", // Country of the seller
    email: email, // Seller's email
    capabilities: {
      card_payments: { requested: true }, // Enable card payments
      transfers: { requested: true }, // Enable payouts
    },
  });

  console.log("Express Account Created:", account.id);
  return account.id;
}
export async function generateOnboardingLink(accountId: string) {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: "https://your-website.com/reauth", // URL to redirect if re-authentication is needed
    return_url: "https://your-website.com/complete", // URL to redirect after onboarding is complete
    type: "account_onboarding", // Type of link (onboarding)
  });
  return accountLink.url;
}

// (async () => {
//   // const id: string = await createAccount("seller2@example.com");
//   // const link = await generateOnboardingLink("acct_1RBt3kQrPf8kNNMH");
//   // console.log(link);
//   // console.log(`Onboarding link => ${link}`);
//   createSession("acct_1RBt3kQrPf8kNNMH");
// })();
