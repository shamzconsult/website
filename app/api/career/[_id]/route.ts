import Hiring from "@/app/models/hiring";
import connectMongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";

const GET = async (request: any, { params }: { params: { _id: string } }) => {
  try {
    const id = params._id;
    await connectMongoDB();
    const job = await Hiring.findOne({ _id: id });
    if (!job) {
      return NextResponse.json({ message: "job not found!!" }, { status: 404 });
    }
    return NextResponse.json({ job }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching job by id " },
      { status: 500 }
    );
  }
};

const PUT = async (request: any, { params }: { params: { _id: string } }) => {
  try {
    const id = params._id;

    const {
      newTitle: title,
      newType: type,
      newMode: mode,
      newLocation: location,
      newIsAcitive: isActive,
    } = await request.json();

    await connectMongoDB();

    const job = await Hiring.findById(id);

    await Hiring.findByIdAndUpdate(id, {
      title,
      type,
      mode,
      location,
      isActive,
    }, { new: true });

    return NextResponse.json(
      { message: "job post updated successfully!!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "failed to update job  " },
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

    const JobToDelete = await Hiring.findByIdAndUpdate(
      params._id,
      { isActive: false },
      { new: true }
    );
    if (!JobToDelete) {
      return NextResponse.json(
        { message: "Testimony to delete not found  " },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Event deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete event" },

      { status: 500 }
    );
  }
};

export { GET, PUT, DELETE };
