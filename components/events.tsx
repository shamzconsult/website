"use client";
import React, { useState, useEffect } from "react";
import "aos/dist/aos.css";
import { getCurrentEvent } from "./upcoming-event";
import Link from "next/link";
import Loading from "./loader";
import Footer from "./ui/footer";

interface EventType {
  image: string;
  title: string;
  description: string;
  startDate: number;
  endDate: number;
  _id: number;
  isActive: boolean;
}

export const formatDate = (timestamp: number): string => {
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
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await getCurrentEvent();
      setEvent(data.events);
      setLoading(false);
    } catch (error) {
      console.log("Error loading data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const checkForUpcomingEvents = (eventDate: EventType[]) => {
    const todayTimestamp = Date.now();
    return eventDate.filter((item) => {
      const eventEndDate = new Date(item.endDate).getTime();
      return eventEndDate > todayTimestamp;
    });
  };
  const checkForPastEvents = (eventDate: EventType[]) => {
    const todayTimestamp = Date.now();
    return eventDate.filter((item) => {
      const eventEndDate = new Date(item.endDate).getTime();
      return eventEndDate < todayTimestamp;
    });
  };

  const filteredPastEvents = checkForPastEvents(event);
  const filteredUpcomingEvents = checkForUpcomingEvents(event);

  const EventPageLoader = () => (
    <div className="min-h-[70vh] flex justify-center items-center">
      <Loading />
    </div>
  );

  return (
    <>
      {loading ? (
        <EventPageLoader />
      ) : (
        <div className="flex flex-col justify-center items-center gap-20 text-gray-600 p-8">
          <section className="flex flex-col justify-center items-center gap-6">
            <h1 className="font-bold text-lg">Upcoming Events</h1>
            <div className="flex flex-wrap justify-center items-start gap-8">
              {filteredUpcomingEvents.length > 0 ? (
                filteredUpcomingEvents.map(
                  ({ image, startDate, endDate, title, _id, isActive }) =>
                    isActive && (
                      <Link
                        href={`/events/${_id}`}
                        key={_id}
                        className="flex flex-col gap-2 lg:w-[25%] border border-slate-100 rounded-md overflow-hidden hover:border-orange-300"
                      >
                        <img
                          className="h-full w-full object-contain lg:h-[50vh] object-top"
                          src={image}
                          alt="event"
                        />
                        <div className="flex flex-col gap-2 p-2">
                          <h2 className="opacity-70 font-bold">{title}</h2>
                          <div className="flex gap-4">
                            <p>{formatDate(startDate)}</p>
                            <h1 className="bold text-lg">-</h1>
                            <p>{formatDate(endDate)}</p>
                          </div>
                        </div>
                      </Link>
                    )
                )
              ) : (
                <div>No upcoming event for now...</div>
              )}
            </div>
          </section>
          <section className="flex flex-col justify-center items-center gap-6">
            <h1 className="font-bold text-lg">Past Events</h1>
            <div className="flex flex-wrap justify-center items-start gap-8">
              {filteredPastEvents.length > 0 ? (
                filteredPastEvents.map(
                  ({ image, startDate, endDate, title, isActive, _id }) =>
                    isActive && (
                      <Link
                        href={`/events/${_id}`}
                        key={_id}
                        className="flex flex-col gap-2 lg:w-[25%]  border border-slate-100 rounded-md overflow-hidden p-2 hover:border-orange-300"
                      >
                        <img
                          className="h-full w-full object-contain object-top lg:h-[50vh]"
                          src={image}
                          alt="event"
                        />
                        <div className="flex flex-col gap-2 p-2">
                          <h2 className="opacity-70 font-bold">{title}</h2>
                          <div className="flex gap-4">
                            <p>{formatDate(startDate)}</p>
                            <h1 className="bold text-lg">-</h1>
                            <p>{formatDate(endDate)}</p>
                          </div>
                        </div>
                      </Link>
                    )
                )
              ) : (
                <div>No past event...</div>
              )}
            </div>
          </section>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Events;
