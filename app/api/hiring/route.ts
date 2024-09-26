import Hiring from "@/app/models/hiring";
import connectMongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";

const POST = async (request: any) => {
  try {
    const { title, type, mode, about, location } = await request.json();
    await connectMongoDB();

    const result = await Hiring.create({
      title,
      type,
      mode,
      about,
      location,
    });
    return NextResponse.json(
      { message: "New job details added successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Check details, bad request" },
      { status: 500 }
    );
  }
};

const GET = async () => {
  await connectMongoDB();
  const jobs = await Hiring.find();
  return NextResponse.json({ jobs });
};

export { POST, GET };
