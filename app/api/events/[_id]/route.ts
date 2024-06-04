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
    console.log(error);
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
      image: newImage,
      title: newTitle,
      description: newDescription,
      startDate: newStartDate,
      endDate: newEndDate,
    } = request.json();
    await connectMongoDB();
    await UpcomingEvent.findByIdAndUpdate(id, {
      // image,
      // title,
      newDescription,
      newStartDate,
      newEndDate,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error fetching event by id " },
      { status: 500 }
    );
  }
};

export { GET, PUT };
