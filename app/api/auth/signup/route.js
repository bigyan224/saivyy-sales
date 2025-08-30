// app/api/auth/signup/route.ts
import { prisma } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { email } = await req.json();

        const user = await prisma.user.findUnique({
            where: { email }
        })
    if (user) {
        return new Response(
            JSON.stringify({ error: "User already exists" }),
            { status: 403 }
        );
    }
    // 1. Check if the email exists in invited emails
    const invited = await prisma.invitedEmail.findUnique({
      where: { email },
    });

    if (!invited) {
      return new Response(
        JSON.stringify({ error: "Email is not invited" }),
        { status: 403 }
      );
    }

    // 3. Mark invite as used (optional)
    await prisma.invitedEmail.update({
      where: { email },
      data: { is_used: true },
    });

    return new Response(JSON.stringify({ message: "User is invited" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Signup failed" }), { status: 500 });
  }
}
