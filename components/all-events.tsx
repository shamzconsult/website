"use client";
import React, { useState, useEffect } from "react";
import "aos/dist/aos.css";
import { getCurrentEvent } from "./upcoming-event";
import Link from "next/link";
import Loading from "./loader";
import Footer from "./ui/footer";
import { formatDate } from "./events";

interface EventType {
  image: string;
  title: string;
  description: string;
  startDate: number;
  endDate: number;
  _id: number;
  isActive: boolean;
}

const AllEvents = () => {
  const [event, setEvent] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await getCurrentEvent();
      console.log(data);
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

  const changeEventStatus = (id: number) => {
    setEvent((prevEvents) =>
      prevEvents.map((event) =>
        event._id === id ? { ...event, isActive: !event.isActive } : event
      )
    );
  };

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
            <h1 className="font-bold text-lg">All Events</h1>
            <div className="flex flex-wrap justify-center items-start gap-8">
              {event.length > 0 ? (
                event.map(
                  ({ image, startDate, endDate, title, _id, isActive }) => (
                    <div className="flex flex-col gap-2 lg:w-[25%] border border-slate-100 rounded-md overflow-hidden hover:border-orange-300">
                      <Link href={`/events/${_id}`} key={_id}>
                        <img
                          className="h-full w-full object-contain  object-top"
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
                      <div className="p-2 flex justify-between items-center">
                        <Link href={"/editevent"}>
                          <button className="bg-green-100 rounded-md w-fit px-5 font-medium border hover:border-orange-300 hover:bg-white">
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => changeEventStatus(_id)}
                          className="bg-red-500 text-white rounded-md w-fit px-5 font-medium border  hover:bg-red-600"
                        >
                          {isActive ? "Disable" : "Enable"}
                        </button>
                      </div>
                    </div>
                  )
                )
              ) : (
                <div>No event for now...</div>
              )}
            </div>
          </section>
        </div>
      )}
      <Footer />
    </>
  );
};

export default AllEvents;
