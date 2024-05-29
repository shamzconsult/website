"use client";
import React, { useState, useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import { Cross1Icon } from "@radix-ui/react-icons";

interface EventType {
  image: string;
  _id: number;
}

export const getCurrentEvent = async () => {
  try {
    const res = await fetch("/api/event", {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Error found while fetching");
    }
    return res.json();
  } catch (error) {
    console.log("Error loading data", error);
  }
};

const UpcomingEvent = () => {
  const [openModal, setModal] = useState(true);
  const [event, setEvent] = useState<EventType | null>(null);

  const fetchData = async () => {
    try {
      const data = await getCurrentEvent();
      if (data && data.events && data.events.length > 0) {
        setEvent(data.events[data.events.length - 1] as EventType);
      }
    } catch (error) {
      console.log("Error loading data", error);
    }
  };

  useEffect(() => {
    Aos.init();
    fetchData();
  }, []);

  const handleClose = () => {
    setModal((prev) => !prev);
  };

  if (!event) return null;
  return (
    <div
      id="my-modal"
      className={`modal fixed inset-0 z-50 overflow-y-auto sm:px-0  bg-opacity-60 transition-opacity duration-300 ease-in-out backdrop-blur-sm ${
        openModal ? "" : "hidden"
      }`}
    >
      <main
        data-aos="fade-down"
        data-aos-duration="2000"
        data-aos-easing="ease-in-out"
        className={`${
          openModal ? "" : "hidden"
        }  bg-black/60 min-h-screen backdrop-blur-md flex flex-col justify-center items-center gap-6 py-12 px-4 lg:px-14`}
      >
        <div className="fixed top-8 right-4 lg:right-14">
          <button
            onClick={handleClose}
            type="button"
            className="w-fit px-2 py-1 font-bold text-white bg-orange-600 hover:bg-orange-700 duration-150 rounded-sm "
          >
            <Cross1Icon />
          </button>
        </div>
        {event && (
          <Link href={`/events/${event._id}`}>
            <img
              className="max-h-[600px] h-full w-full rounded object-contain object-top cursor-pointer"
              src={event.image}
              alt="event"
            />
            <p className="text-sm text-orange-400 text-center font-semibold">
              Click for more details
            </p>
          </Link>
        )}
      </main>
    </div>
  );
};

export default UpcomingEvent;
