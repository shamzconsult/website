import Hiring from "@/app/(site)/models/hiring";
import connectMongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";

const GET = async (
  request: any,
  { params }: { params: Promise<{ _id: string }> }
) => {
  try {
    const { _id: id } = await params;
    await connectMongoDB();
    const job = await Hiring.findOne({ _id: id, isDeleted: { $ne: true } });
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

const PUT = async (
  request: any,
  { params }: { params: Promise<{ _id: string }> }
) => {
  try {
    const { _id: id } = await params;

    const {
      newTitle: title,
      newType: type,
      newMode: mode,
      newLocation: location,
      newFormId: formId,
      newClosing: closing,
      newRequirements: requirements,
      newDescription: description,
      newIsActive: isActive,
    } = await request.json();

    await connectMongoDB();

    const updatedJob = await Hiring.findByIdAndUpdate(
      id,
      {
        title,
        type,
        mode,
        location,
        formId,
        closing,
        requirements,
        description,
        isActive,
      },
      { new: true }
    );

    return NextResponse.json(
      { message: "job post updated successfully!!", job: updatedJob },
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
  { params }: { params: Promise<{ _id: string }> }
) => {
  try {
    const { _id } = await params;
    await connectMongoDB();

    const closeJobOpening = await Hiring.findByIdAndUpdate(
      _id,
      { isDeleted: true },
      { new: true }
    );
    if (!closeJobOpening) {
      return NextResponse.json(
        { message: "Job to delete not found  " },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Job deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete Job" },

      { status: 500 }
    );
  }
};

const PATCH = async (
  request: any,
  { params }: { params: Promise<{ _id: string }> }
) => {
  try {
    const { _id: id } = await params;
    const { isActive } = await request.json();
    await connectMongoDB();

    const updatedJob = await Hiring.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    if (!updatedJob) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Status updated successfully", job: updatedJob },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update Job status" },
      { status: 500 }
    );
  }
};

export { GET, PUT, DELETE, PATCH };
