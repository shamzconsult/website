import Hiring from "@/app/models/hiring";
import connectMongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";

const POST = async (request: any) => {
  try {
    const {
      title,
      description,
      eligibility,
      type,
      mode,
      about,
      payment,
      location,
    } = await request.json();
    await connectMongoDB();

    const result = await Hiring.create({
      title,
      description,
      eligibility,
      type,
      mode,
      about,
      location,
      payment,
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
  try {
    await connectMongoDB();
    const jobs = await Hiring.find();
    console.log(jobs);
    return NextResponse.json({ jobs });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};

export { POST, GET };
