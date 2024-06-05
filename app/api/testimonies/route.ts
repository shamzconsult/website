import Testimonials from "@/app/models/testimonies";
import connectMongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";

const POST = async (request: any) => {
  try {
    const { image, testimony, name, companyName, companyTitle } =
      await request.json();
    await connectMongoDB();

    const result = await Testimonials.create({
      image,
      testimony,
      name,
      companyName,
      companyTitle,
    });
    return NextResponse.json(
      { message: "New testimony details added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Check details, bad request" },
      { status: 500 }
    );
  }
};

const GET = async () => {
  await connectMongoDB();
  const testimony = await Testimonials.find();
  return NextResponse.json({ testimony });
};

export { POST, GET };
