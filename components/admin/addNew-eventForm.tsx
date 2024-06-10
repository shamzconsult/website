"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EventAlert } from "../utils/login-alert";

export default function AddNewEventForm() {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!image || !title || !description || !startDate || !endDate) {
      return;
    }

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          image,
          title,
          description,
          startDate,
          endDate,
        }),
      });
      if (res.ok) {
        EventAlert();
        router.push("/events");
      } else {
        throw new Error("Event failed to add");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-6 bg-slate-50 rounded-md p-10 lg:w-[70%]"
    >
      <input
        onChange={(e) => setImage(e.target.value)}
        value={image}
        type="url"
        placeholder="https://cdn.hashnode.com/res/hashnode/image/upload/5432338f.jpeg"
        className="rounded-md border border-slate-200 w-full p-2 outline-none placeholder:opacity-50"
        required
      />
      <input
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        type="text "
        placeholder="Title.."
        className="rounded-md border border-slate-200 w-full p-2 outline-none placeholder:opacity-50"
        required
      />
      <textarea
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        rows={5}
        placeholder="Event description"
        className="rounded-md border border-slate-200 w-full p-2 outline-none placeholder:opacity-50"
        required
      />
      <input
        onChange={(e) => setStartDate(e.target.value)}
        value={startDate}
        type="text "
        placeholder="StartDate e.g Jul-06-2024"
        className="rounded-md border border-slate-200 w-full p-2 outline-none placeholder:opacity-50"
        required
      />
      <input
        onChange={(e) => setEndDate(e.target.value)}
        value={endDate}
        type="text"
        placeholder="EndDate e.g Dec-18-2024"
        className="rounded-md border border-slate-200 w-full p-2 outline-none placeholder:opacity-50"
        required
      />
      <button
        type="submit"
        className="rounded-md bg-orange-500 px-8 py-2 w-fit font-semibold text-white hover:bg-orange-700 duration-200 "
      >
        Add Event
      </button>
    </form>
  );
}
