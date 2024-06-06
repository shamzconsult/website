"use client";
import React, { useState, useEffect } from "react";
import "aos/dist/aos.css";
import { getCurrentEvent } from "./upcoming-event";
import Link from "next/link";
import Loading from "./loader";
import Footer from "./ui/footer";
import { formatDate } from "./events";
import Swal from "sweetalert2";

interface EventType {
  image: string;
  title: string;
  description: string;
  startDate: number;
  endDate: number;
  _id: number;
  isActive: boolean;
}

export const deleteData = async (_id: number) => {
  try {
    const res = await fetch(`/api/events/${_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Error occurred while deleting");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error deleting ", error);
  }
};

const AllEvents = () => {
  const [event, setEvent] = useState<EventType[]>([]);
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

  const EventPageLoader = () => (
    <div className="min-h-[70vh] flex justify-center items-center">
      <Loading />
    </div>
  );

  const handleDelete = async (_id: number) => {
    try {
      const result = await deleteData(_id);
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          setEvent((prevEvents: any) =>
            prevEvents.filter((event: any) => event._id !== _id)
          );
          Swal.fire({
            title: "Deleted!",
            text: "Event has been deleted.",
            icon: "success",
          });
        }
      });
    } catch (error) {
      console.error("Error deleting ", error);
    }
  };

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
                event.map(({ image, startDate, endDate, title, _id }) => (
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
                      <Link href={`/editevent/${_id}`}>
                        <button className="bg-green-100 rounded-md w-fit px-5 font-medium border hover:border-orange-300 hover:bg-white">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(_id)}
                        className="bg-red-500 text-white rounded-md w-fit px-5 font-medium border  hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
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
