import UpcomingEvent from "@/app/models/upcoming-event";
import connectMongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";

const GET = async (request: any, { params }: { params: { _id: string } }) => {
  try {
    const id = params._id;
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

const PUT = async (request: any, { params }: { params: { _id: string } }) => {
  try {
    const id = params._id;
    const {
      newImage: image,
      newTitle: title,
      newDescription: description,
      newStartDate: startDate,
      newEndDate: endDate,
    } = await request.json();
    await connectMongoDB();
    await UpcomingEvent.findByIdAndUpdate(id, {
      image,
      title,
      description,
      startDate,
      endDate,
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

export { GET, PUT };
