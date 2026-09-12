import UpcomingEvent from "@/app/(site)/models/upcoming-event";
import connectMongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";

const GET = async (
  request: any,
  { params }: { params: Promise<{ _id: string }> }
) => {
  try {
    const { _id: id } = await params;
    await connectMongoDB();
    const event = await UpcomingEvent.findOne({ _id: id });
    if (!event) {
      return NextResponse.json(
        { message: "Event not found!!" },
        { status: 404 }
      );
    }
    return NextResponse.json({ event }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching event by id " },
      { status: 500 }
    );
  }
};

const PUT = async (
  request: any,
  { params }: { params: Promise<{ _id: string }> }
) => {
  try {
    const { _id: id } = await params;
    const {
      newImage: image,
      newTitle: title,
      newDescription: description,
      newStartDate: startDate,
      newEndDate: endDate,
      newRegistrationLink: registrationLink,
    } = await request.json();
    await connectMongoDB();
    await UpcomingEvent.findByIdAndUpdate(id, {
      image,
      title,
      description,
      startDate,
      endDate,
      registrationLink,
    });
    return NextResponse.json(
      { message: "Event updated successfully!!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "failed to update event  " },
      { status: 500 }
    );
  }
};

const DELETE = async (
  request: any,
  { params }: { params: Promise<{ _id: string }> }
) => {
  try {
    const { _id } = await params;
    await connectMongoDB();
    const dataToDelete = await UpcomingEvent.findByIdAndUpdate(
      _id,
      { isActive: false },
      { new: true }
    );
    if (!dataToDelete) {
      return NextResponse.json(
        { message: "Data to delete not found  " },
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
