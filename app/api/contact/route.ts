import connectMongoDB from "./../../../libs/mongodb";
import { NextResponse } from "next/server";
import Contact from "./../../model/contact";

const POST = async (request: any) => {
  try {
    await connectMongoDB();
    const { name, email, message } = await request.json();
    const result = await Contact.create({ name, email, message });
    console.log(result);
    return NextResponse.json(
      { message: "New message sent successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
  }
};

const GET = async () => {
  await connectMongoDB();
  const contact = await Contact.find();
  return NextResponse.json({ contact });
};

export { POST, GET };
