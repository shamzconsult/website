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
      newGallery: gallery,
    } = await request.json();
    await connectMongoDB();
    await UpcomingEvent.findByIdAndUpdate(id, {
      image,
      title,
      description,
      startDate,
      endDate,
      gallery,
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
  { params }: { params: { _id: string } }
) => {
  try {
    await connectMongoDB();
    const dataToDelete = await UpcomingEvent.findByIdAndUpdate(
      params._id,
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

const DELETE_IMAGE = async (
  request: any,
  { params }: { params: { _id: string } }
) => {
  try {
    await connectMongoDB();
    const id = params._id;
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { message: "the image you want to delete does not exist" },
        { status: 400 }
      );
    }

    const event = await UpcomingEvent.findById(id);
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    const updatedGallery = event.gallery.filter(
      (url: string) => url !== imageUrl
    );

    await UpcomingEvent.findByIdAndUpdate(id, { gallery: updatedGallery });

    return NextResponse.json(
      { message: "Image deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete image" },
      { status: 500 }
    );
  }
};

export { GET, PUT, DELETE, DELETE_IMAGE as DELETE_IMAGE };
