import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { client, amount, status, details, category, date } = await req.json();

    const { userId } =await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sale = await prisma.sale.create({
      data: {
        client,
        amount,
        status,
        details,
        category,
        date: new Date(date), // ensure proper Date
        userId,
      },
    });

    return NextResponse.json({ sale }, { status: 200 });
  } catch (error) {
    console.error("Error creating sale:", error);
    return NextResponse.json({ error: error.message || "Invalid request" }, { status: 400 });
  }
}

export async function GET() {
    const { userId } =await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sales = await prisma.sale.findMany();

    return NextResponse.json({ sales }, { status: 200 });
  }

