"use client";
import React, { useState, useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
// import { BsX } from "react-icons";

interface EventType {
  image: string;
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
    Aos.init();
    fetchData();
  }, []);

  const handleClose = () => {
    setModal((prev) => !prev);
  };
  return (
    <div
      id='my-modal'
      className={`modal fixed inset-0 z-50 overflow-y-auto sm:px-0 bg-gray-800 bg-opacity-60 transition-opacity duration-300 ease-in-out backdrop-blur-sm ${
        openModal ? "" : "hidden"
      }`}
    >
      <main
        data-aos='fade-down'
        data-aos-duration='2000'
        data-aos-easing='ease-in-out'
        className={`${
          openModal ? "" : "hidden"
        }  bg-[#fff]/40 min-h-screen rounded-lg backdrop-blur-md flex flex-col items-end gap-6 py-12 px-4 lg:px-14`}
      >
        <button
          onClick={handleClose}
          type='button'
          className=' w-fit px-2 py-1  font-bold text-white bg-orange-600 hover:bg-orange-700 duration-150 rounded-sm   '
        >
          {/* <BsX size={40} /> */}
          close
        </button>
        {event.map((item: EventType) => (
          <img
            className='max-h-[600px] h-full w-full rounded object-contain object-top'
            src={item.image}
            alt='event'
          />
        ))}
      </main>
    </div>
  );
};

export default UpcomingEvent;
