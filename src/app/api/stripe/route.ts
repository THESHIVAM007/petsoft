import prisma from "@/lib/db";
import { log } from "console";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request: Request) {
  const data = await request.text();
  const signature = request.headers.get("stripe-signature");
  //verify  the webhook cam from stripe
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      data,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.log("Webhook Error", error);
    return Response.json(null, { status: 400 });
  }

  //fulfill the order

  switch (event.type) {
    case "checkout.session.completed":
      await prisma.user.update({
        where: { email: event.data.object.customer_email },
        data: {
          hasAccess: true,
        },
      });
      break;
    default:
      return Response.json(null, { status: 200 });
  }

  //return 200 OK
  return Response.json(null, { status: 201 });
}
