"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./loader";
import BackIcon from "./icons/back-arrow";
import { formatDate } from "./events";
import Footer from "./ui/footer";
import { DownloadIcon, Cross1Icon } from "@radix-ui/react-icons";
interface EventType {
  image: string;
  startDate: number;
  endDate: number;
  title: string;
  description: string;
  gallery: string[];
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
  const [previewImage, setPreviewImage] = useState<string | null>(null);
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

  console.log(event);

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
          <p className="lg:text-2xl text-center font-semibold max-w-[700px] mx-auto ">
            {event.title}
          </p>
          <div className="rounded overflow-hidden border border-orange-300">
            <img src={event.image} alt={event.title} className="w-full" />
          </div>
          <div className="text-gray-500 flex flex-col gap-2">
            <h1 className="text-xl font-semibold text-orange-600 ">About</h1>
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
          {event.gallery.length > 0 && (
            <div>
              <h1 className="text-xl font-semibold text-orange-600">Gallery</h1>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {event.gallery.map((photo, index) => (
                  <div key={index} className="relative h-32 w-40">
                    <img
                      src={photo}
                      alt="g-image"
                      className="h-full w-full object-cover rounded-md border cursor-pointer text-slate-200 "
                      onClick={() => setPreviewImage(photo)}
                    />
                    <a
                      href={photo}
                      download
                      className="absolute bottom-2 right-2 opacity-100 transition-opacity bg-slate-200 p-2 rounded-md hover:bg-slate-500"
                    >
                      <DownloadIcon className="w-6 h-6 text-white " />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
          {previewImage && (
            <div
              className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
              onClick={() => setPreviewImage(null)}
            >
              <div className="relative max-w-[50vw] max-h-[50vh] overflow-auto p-4 bg-white rounded-md">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                />
                <button
                  onClick={() => setPreviewImage(null)}
                  className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-1"
                >
                  <Cross1Icon />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      <Footer />
    </>
  );
};

export default EventPreview;
