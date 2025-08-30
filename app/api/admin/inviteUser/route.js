import { Clerk } from "@clerk/clerk-sdk-node";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const clerkClient = new Clerk({ apiKey: process.env.CLERK_SECRET_KEY});

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400 }
      );
    }

    const existing = await prisma.invitedEmail.findUnique({
      where: { email },
    });

    if (existing) {
      return new Response(
        JSON.stringify({ error: "User already invited" }),
        { status: 400 }
      );
    }

    // Save in DB
    const invite = await prisma.invitedEmail.create({
      data: { email },
    });

    // Create Clerk invitation
    const invitation = await clerkClient.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: "https://saivyy-sales-9zrpsdq96-bigyan-acharyas-projects.vercel.app/", // your signup page
    });

    return new Response(
      JSON.stringify({ success: true, invite, invitation }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Invite error:", error);
    return new Response("Server error", { status: 500 });
  }
}
