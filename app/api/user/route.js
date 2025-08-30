import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const { userId } =await auth(); // Clerk user ID

  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  // find the user in your DB by Clerk userId
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser) {
    return NextResponse.json({ error: "User not found in DB" }, { status: 404 });
  }

  return NextResponse.json(dbUser);
}
