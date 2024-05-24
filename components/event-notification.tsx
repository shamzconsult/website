"use client";
import React, { useState, useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import { BsX } from "react-icons/bs";

const EventNotification = () => {
  const [openModal, setModal] = useState(true);

  useEffect(() => {
    Aos.init();
  }, []);

  const handleClose = () => {
    setModal((prev) => !prev);
  };
  return (
    <div
      id="my-modal"
      className={`modal fixed inset-0 z-50 overflow-y-auto  sm:px-0 bg-gray-800 bg-opacity-60 transition-opacity duration-300 ease-in-out backdrop-blur-sm ${
        openModal ? "" : "hidden"
      }`}
    >
      <main
        data-aos="fade-down"
        data-aos-duration="2000"
        data-aos-easing="ease-in-out"
        className={`${
          openModal ? "" : "hidden"
        }  bg-[#fff]/40 rounded-lg backdrop-blur-md flex flex-col items-end gap-6 py-12 px-4 lg:px-14`}
      >
        <button
          onClick={handleClose}
          type="button"
          className=" w-fit px-2 py-1  font-bold text-white bg-orange-600 hover:bg-orange-700 duration-150 rounded-sm   "
        >
          <BsX size={40} />
        </button>
        <img
          className="max-h-[600px] h-full w-full rounded object-contain object-top"
          src="https://cdn.hashnode.com/res/hashnode/image/upload/v1716541841428/0d584802-407d-4892-b09c-d04d499479cf.jpeg"
          alt="event"
        />
      </main>
    </div>
  );
};

export default EventNotification;
