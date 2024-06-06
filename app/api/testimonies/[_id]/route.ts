import Testimonials from "@/app/models/testimonies";
import connectMongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";

const GET = async (request: any, { params }: { params: { _id: string } }) => {
  try {
    const id = params._id;
    await connectMongoDB();
    const testimony = await Testimonials.findOne({ _id: id });
    if (!testimony) {
      return NextResponse.json(
        { message: "testimony not found!!" },
        { status: 404 }
      );
    }
    return NextResponse.json({ testimony }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching testimony by id " },
      { status: 500 }
    );
  }
};

const PUT = async (request: any, { params }: { params: { _id: string } }) => {
  try {
    const id = params._id;

    const {
      newImage: image,
      newName: name,
      newTestimony: testimony,
      newCompanyName: companyName,
      newCompanyTitle: companyTitle,
    } = await request.json();
    await connectMongoDB();
    await Testimonials.findByIdAndUpdate(id, {
      image,
      name,
      testimony,
      companyName,
      companyTitle,
    });
    return NextResponse.json(
      { message: "Testimony updated successfully!!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "failed to update Testimony" },
      { status: 500 }
    );
  }
};

const DELETE = async (
  request: any,
  { params }: { params: { _id: string } }
) => {
  try {
    await connectMongoDB();
    const testimonyToDelete = await Testimonials.findByIdAndUpdate(
      params._id,
      { isActive: false },
      { new: true }
    );
    if (!testimonyToDelete) {
      return NextResponse.json(
        { message: "Testimony to delete not found  " },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Testimony deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete Testimony" },

      { status: 500 }
    );
  }
};
export { GET, PUT, DELETE };
