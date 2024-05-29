"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./loader";
import BackIcon from "./icons/back-arrow";

interface EventType {
  image: string;
  startDate: string;
  endDate: string;
  title: string;
  description: string;
}

export const getEventById = async (_id: string) => {
  try {
    const res = await fetch(`/api/event/${_id}`, {
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

const EventPreview = () => {
  const [event, setEvent] = useState<EventType | null>(null);
  const { id } = useParams();

  const fetchData = async () => {
    try {
      const data = await getEventById(id as string);
      if (data) {
        setEvent(data.event);
      }
    } catch (error) {
      console.error("Error loading data", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const loading = !event;

  const EventPageLoader = () => (
    <div className="min-h-[60vh] flex justify-center items-center">
      <Loading />
    </div>
  );

  return (
    <>
      {loading ? (
        <EventPageLoader />
      ) : (
        <div className="mx-auto w-[90%] flex flex-col gap-3 py-8 lg:w-[70%] font-bold text-xl text-orange-600">
          <div className="rounded overflow-hidden border border-orange-300">
            <img src={event.image} alt={event.title} className="w-full" />
          </div>
          <p>{event.title}</p>
          <p className="text-gray-500 font-normal text-sm ">
            {event.description}
          </p>
          <div className="flex gap-4 bold">
            <p>{event.startDate}</p>
            <h1 className=" text-lg">-</h1>
            <p>{event.endDate}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default EventPreview;
