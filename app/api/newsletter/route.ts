import { NextResponse } from "next/server";
import NewsLetter from "./../../models/newsletter";
import connectMongoDB from "@/libs/mongodb";

const POST = async (request: any) => {
  try {
    await connectMongoDB();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const result = await NewsLetter.create({ email });
    console.log(result);
    return NextResponse.json(
      { message: "Successfully subscribed to Shamz-bridge newsletter" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
  }
};

const GET = async () => {
  await connectMongoDB();
  const newsletter = await NewsLetter.find();
  return NextResponse.json({ newsletter });
};

export { POST, GET };
