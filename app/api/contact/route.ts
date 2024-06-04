import connectMongoDB from "./../../../libs/mongodb";
import { NextResponse } from "next/server";
import Contact from "../../models/contact";

const POST = async (request: any) => {
  try {
    await connectMongoDB();
    const { name, email, message } = await request.json();
    const result = await Contact.create({ name, email, message });
    return NextResponse.json(
      { message: "New message sent successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
  }
};

export { POST };
