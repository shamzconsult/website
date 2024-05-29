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

  if (!event) {
    return <Loading />;
  }

  return (
    <div className="mx-auto w-[90%] flex flex-col gap-3 py-8 lg:w-[70%] font-bold text-xl text-orange-600">
      {/* <Link href={"/events"}>
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z"
            fill="currentColor"
            fill-rule="evenodd"
            clip-rule="evenodd"
          ></path>
        </svg>
      </Link> */}
      <BackIcon />
      <p>{event.title}</p>
      <img src={event.image} alt={event.title} className="w-100%]  " />
      <div className="text-gray-500 font-normal text-sm ">
        <h1 className="font-bold text-2xl">About</h1>
        <p>{event.description}</p>
      </div>
      <div className="flex gap-4 bold">
        <p>{event.startDate}</p>
        <h1 className=" text-lg">-</h1>
        <p>{event.endDate}</p>
      </div>
    </div>
  );
};

export default EventPreview;
