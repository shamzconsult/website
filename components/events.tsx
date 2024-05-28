"use client";
import React, { useState, useEffect } from "react";
import "aos/dist/aos.css";
import { getCurrentEvent } from "./upcoming-event";
import Link from "next/link";

interface EventType {
  image: string;
  title: string;
  description: string;
  startDate: number;
  endDate: number;
  _id: number;
}

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const options = { month: "short", day: "numeric" } as const;
  const formattedDate = date.toLocaleDateString("en-US", options);

  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return `${formattedDate.split(" ")[0]}-${day}${suffix}`;
};

const Events = () => {
  const [event, setEvent] = useState([]);

  const fetchData = async () => {
    try {
      const data = await getCurrentEvent();
      setEvent(data.events);
    } catch (error) {
      console.log("Error loading data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center gap-20 text-gray-600 p-8">
      <section className="flex flex-col justify-center items-center gap-6">
        <h1 className="font-bold text-lg">Upcoming Events</h1>
        <div className="flex flex-wrap justify-center items-start gap-8">
          {event.map(
            ({
              image,
              startDate,
              endDate,
              title,
              description,
              _id,
            }: EventType) => (
              <div
                key={_id}
                className="flex flex-col gap-2 lg:w-[25%] border border-slate-100 rounded-md p-2 hover:border-orange-300"
              >
                <Link href={`/event/${_id}`}>
                  <img
                    className=" h-full w-full  object-contain object-top cursor-pointer rounded-lg "
                    src={image}
                    alt="event"
                  />
                </Link>
                <h2 className="opacity-70 font-bold">{title}</h2>
                <div className="flex gap-4 ">
                  <p>{formatDate(startDate)}</p>
                  <h1 className="bold text-lg">-</h1>
                  <p>{formatDate(endDate)}</p>
                </div>
                {/* <p>{description}</p> */}
              </div>
            )
          )}
        </div>
      </section>
      <section className="flex flex-col justify-center items-center gap-6">
        <h1 className="font-bold text-lg">Past Events</h1>
        <div className="flex flex-wrap justify-center items-start gap-8">
          {event.map(({ image, startDate, endDate, title, _id }: EventType) => (
            <div
              key={_id}
              className="flex flex-col gap-2 lg:w-[25%] border border-slate-100 rounded-md p-2 hover:border-orange-300"
            >
              <img
                className=" h-full w-full  object-contain object-top cursor-pointer rounded-lg "
                src={image}
                alt="event"
              />
              <h2 className="opacity-70 font-bold">{title}</h2>
              <div className="flex gap-4 ">
                <p>{formatDate(startDate)}</p>
                <h1 className="bold text-lg">-</h1>
                <p>{formatDate(endDate)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Events;
