import UpcomingEvent from "@/app/models/upcoming-event";
import connectMongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: any) {
  try {
    const { image, startDate, endDate } = await request.json();
    await connectMongoDB();
    const result = await UpcomingEvent.create({ image, startDate, endDate });
    console.log(result);
    return NextResponse.json(
      { message: "New event details added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
  }
}

export async function GET() {
  await connectMongoDB();
  const events = await UpcomingEvent.find();
  return NextResponse.json({ events });
}
