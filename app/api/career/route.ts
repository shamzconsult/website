import Hiring from "@/app/models/hiring";
import connectMongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";

const POST = async (request: any) => {
  try {
    const { title, type, mode, location, formId } = await request.json();
    await connectMongoDB();

    if (!title || !type || !mode || (mode !== "Remote" && !location) || !formId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await Hiring.create({
      formId,
      title,
      type,
      mode,
      location,
    });

    return NextResponse.json(
      { message: "New job details added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding job:", error);
    return NextResponse.json(
      { message: "Check details, bad request" },
      { status: 500 }
    );
  }
};

const GET = async () => {
  try {
    await connectMongoDB();
    const jobs = await Hiring.find({}).sort({ createdAt: -1 });  
      return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { message: "Error fetching jobs" },
      { status: 500 }
    );
  }
};

export { POST, GET };
