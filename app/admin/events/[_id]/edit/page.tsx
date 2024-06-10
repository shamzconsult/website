"use client";
import EditEventForm from "@/components/admin/edit-eventForm";
import Loading from "@/components/loader";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const getEventById = async (_id: string) => {
  try {
    const res = await fetch(`/api/events/${_id}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Error found while fetching");
    }
    return res.json();
  } catch (error) {
    console.error("Error loading data", error);
    return null;
  }
};

export default function EditAnEvent() {
  const { _id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const eventData = await getEventById(_id as string);
      setEvent(eventData.event);
      setLoading(false);
    };

    fetchData();
  }, [_id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-red-500 text-sm text-center p-4">
        Error loading event details, Please check the event id
      </div>
    );
  }

  const { image, title, description, startDate, endDate } = event;

  return (
    <div>
      <EditEventForm
        _id={_id}
        image={image}
        title={title}
        description={description}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
}
