"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "./ui/footer";
import { formatDate } from "./events";

export default function EditEventForm({
  _id,
  image,
  title,
  description,
  startDate,
  endDate,
}: any) {
  const [newImage, setNewImage] = useState(image);
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [newStartDate, setNewStartDate] = useState(startDate);
  const [newEndDate, setNewEndDate] = useState(endDate);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (
      !newImage ||
      !newTitle ||
      !newDescription ||
      !newStartDate ||
      !newEndDate
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/events/${_id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          newImage,
          newTitle,
          newDescription,
          newStartDate,
          newEndDate,
        }),
      });
      if (res.ok) {
        router.push("/newevent");
      } else {
        throw new Error("Event failed to add");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="my-32 flex flex-col gap-6  bg-slate-50 p-2 mx-auto w-[90%] lg:w-[60%]"
      >
        <input
          onChange={(e) => setNewImage(e.target.value)}
          value={newImage}
          type="url"
          placeholder="https://cdn.hashnode.com/res/hashnode/image/upload/5432338f.jpeg"
          className="border border-slate-400 focus:border-red-400 w-full p-2 outline-none placeholder:opacity-50"
          required
        />
        <input
          onChange={(e) => setNewTitle(e.target.value)}
          value={newTitle}
          type="text "
          placeholder="Title.."
          className="border border-slate-400 focus:border-red-400 w-full p-2 outline-none placeholder:opacity-50"
          required
        />
        <textarea
          onChange={(e) => setNewDescription(e.target.value)}
          value={newDescription}
          rows={5}
          placeholder="Event description"
          className="border border-slate-400 focus:border-red-400 w-full p-2 outline-none placeholder:opacity-50"
          required
        />
        <input
          onChange={(e) => setNewStartDate(e.target.value)}
          value={formatDate(newStartDate)}
          type="text "
          placeholder="Jul-06-2024"
          className="border border-slate-400 focus:border-red-400 w-full p-2 outline-none placeholder:opacity-50"
          required
        />
        <input
          onChange={(e) => setNewEndDate(e.target.value)}
          value={formatDate(newEndDate)}
          type="text"
          placeholder="Dec-18-2024"
          className="border border-slate-400 focus:border-red-400 w-full p-2 outline-none placeholder:opacity-50"
          required
        />
        <button
          type="submit"
          className="bg-green-500 px-8 py-2 w-fit font-semibold text-white hover:bg-green-700 duration-200 "
        >
          Update Event
        </button>
      </form>
      <Footer />
    </div>
  );
}
