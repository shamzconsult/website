import UpcomingEvent from "@/app/models/upcoming-event";
import connectMongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";

const POST = async (request: any) => {
  try {
    const { image, startDate, endDate, title, description } =
      await request.json();
    await connectMongoDB();
    const result = await UpcomingEvent.create({
      image,
      startDate,
      endDate,
      title,
      description,
    });
    console.log(result);
    return NextResponse.json(
      { message: "New event details added successfully" },
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
  const events = await UpcomingEvent.find();
  return NextResponse.json({ events });
};

// const DELETE = async (req: Request, res: Response) => {
//   try {
//     const body = await req.json();
//     const { _id } = body;

//     if (!_id) {
//       return NextResponse.json(
//         { message: "Event ID does not exist, please check again" },
//         { status: 400 }
//       );
//     }
//     await connectMongoDB();
//     const result = await UpcomingEvent.findByIdAndDelete(_id);
//     if (!result) {
//       return NextResponse.json({ message: "Event not found" }, { status: 404 });
//     }
//     return NextResponse.json(
//       { message: "Event deleted successfully!!!" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json(
//       { message: "Event not deleted, check details" },
//       {
//         status: 500,
//       }
//     );
//   }
// };

const DELETE = async (request: any) => {
  try {
    const _id = await request.json();
    await connectMongoDB();
    if (!_id) {
      return NextResponse.json(
        { message: "Event ID does not exist, check again!!" },
        { status: 400 }
      );
    }
    const result = await UpcomingEvent.findByIdAndDelete(_id);
    if (result) {
      return NextResponse.json(
        { message: "Event deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error...." },
      { status: 500 }
    );
  }
};

export { POST, GET, DELETE };
