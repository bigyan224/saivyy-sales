import { auth, currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const clerkUser = await currentUser();
    
    // Get fullName from request body if provided (from frontend)
    const body = await request.json().catch(() => ({}));
    const providedFullName = body.fullName;

    // Insert into your DB if not exists
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      // Use provided fullName first, then fall back to Clerk data
      const fullName = providedFullName || 
                      `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() ||
                      clerkUser.unsafeMetadata?.fullName ||
                      '';

      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0].emailAddress,
          name: fullName,
          role: "EMPLOYEE", // or logic to assign ADMIN/EMPLOYEE
        },
      });
    } else if (providedFullName && !user.name) {
      // Update existing user if name is missing and we have it from frontend
      user = await prisma.user.update({
        where: { clerkId: userId },
        data: { name: providedFullName }
      });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}