"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EventAlert } from "../utils/login-alert";

export default function AddNewJobForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [mode, setMode] = useState("");
  const [location, setLocation] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!type || !title || !description || !mode || !location) {
      return;
    }

    try {
      const res = await fetch("/api/hiring", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          type,
          mode,
          location,
        }),
      });
      if (res.ok) {
        EventAlert();
        router.push("/hiring");
      } else {
        throw new Error("job failed to add");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col justify-center gap-6 bg-slate-50 rounded-md p-10 lg:w-[70%]"
    >
      <input
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        type="text "
        placeholder="Job Title.."
        className="rounded-md border border-slate-200 w-full p-2 outline-none placeholder:opacity-50"
        required
      />
      <textarea
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        rows={5}
        placeholder="Job description"
        className="rounded-md border border-slate-200 w-full p-2 outline-none placeholder:opacity-50"
        required
      />
      <input
        onChange={(e) => setType(e.target.value)}
        value={type}
        type="text "
        placeholder="fulltime, part-time, remote"
        className="rounded-md border border-slate-200 w-full p-2 outline-none placeholder:opacity-50"
        required
      />
      <input
        onChange={(e) => setMode(e.target.value)}
        value={mode}
        type="text"
        placeholder="remote, physical, hybrid"
        className="rounded-md border border-slate-200 w-full p-2 outline-none placeholder:opacity-50"
        required
      />
      <input
        onChange={(e) => setLocation(e.target.value)}
        value={location}
        type="text"
        placeholder="Abuja"
        className="rounded-md border border-slate-200 w-full p-2 outline-none placeholder:opacity-50"
      />
      <button
        type="submit"
        className="rounded-md bg-orange-500 px-8 py-2 w-fit font-semibold text-white hover:bg-orange-700 duration-200 "
      >
        Post Job
      </button>
    </form>
  );
}
