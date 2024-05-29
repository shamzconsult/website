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
    <div className='min-h-[60vh] flex justify-center items-center'>
      <Loading />
    </div>
  );

  return (
    <>
      {loading ? (
        <EventPageLoader />
      ) : (
        <div className='mx-auto w-[90%] flex flex-col gap-5 mb-32 lg:w-[70%] font-bold text-xl text-orange-600'>
          <BackIcon />
          <p className='lg:text-2xl text-center'>{event.title}</p>
          <div className='rounded overflow-hidden border border-orange-300'>
            <img src={event.image} alt={event.title} className='w-full' />
          </div>
          <div className='text-gray-500 flex flex-col gap-2'>
            <h1>About</h1>
            <p className=' font-normal text-sm '>{event.description}</p>
          </div>
          <div className='flex gap-4 '>
            <p>{formatDate(event.startDate)}</p>
            <h1 className=' text-lg'>-</h1>
            <p> {formatDate(event.endDate)}</p>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default EventPreview;
