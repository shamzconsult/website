"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./loader";
import BackIcon from "./icons/back-arrow";
import { formatDate } from "./events";
import Footer from "./ui/footer";

interface EventType {
  image: string;
  startDate: number;
  endDate: number;
  title: string;
  description: string;
}

export const getEventById = async (_id: string) => {
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
    <div className="min-h-screen flex justify-center items-center">
      <Loading />
    </div>
  );

  return (
    <>
      {loading ? (
        <EventPageLoader />
      ) : (
        <div className="mx-auto w-[90%] flex flex-col gap-5 mb-32 lg:w-[70%] text-xl text-orange-600">
          <BackIcon />
          <p className="lg:text-2xl text-center font-semibold">{event.title}</p>
          <div className="rounded overflow-hidden border border-orange-300">
            <img src={event.image} alt={event.title} className="w-full" />
          </div>
          <div className="text-gray-500 flex flex-col gap-2">
            <h1 className="text-xl font-semibold text-orange-600">About</h1>
            <p className="font-normal">{event.description}</p>
          </div>
          <div className="flex flex-col gap-2 text-gray-500">
            <h1 className="text-xl font-semibold text-orange-600">Date</h1>
            <div className="flex items-center font-normal">
              <p>{formatDate(event.startDate)}</p>
              <div className="mx-2">-</div>
              <p> {formatDate(event.endDate)}</p>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default EventPreview;
