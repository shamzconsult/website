"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EventAlert } from "../utils/login-alert";
import { NigeriaStates } from "@/app/services/nigeriaStates";

export default function AddNewJobForm() {
  const [formId, setFormId] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [mode, setMode] = useState("");
  const [location, setLocation] = useState("");
  const router = useRouter();


  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!type || !title || !formId || !mode || (mode !== "Remote" && !location)) {
      return;
    }

    try {
      const res = await fetch("/api/career", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          title,
          formId,
          type,
          mode,
          location: mode === "Remote" ? "" : location,
        }),
      });
      if (res.ok) {
        EventAlert();
        router.push("/careers");
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
      className='w-full flex flex-col justify-center gap-6 bg-slate-50 rounded-md p-10 lg:w-[70%]'
    >
      <div className='flex flex-col gap-1 text-sm font-medium capitalize'>
        <label>Tally form Id</label>
        <input
          onChange={(e) => setFormId(e.target.value)}
          value={formId}
          type='text'
          placeholder='Tally form id'
          className='rounded-md border bg-white border-slate-200 w-full p-2 outline-none placeholder:opacity-50'
          required
        />
      </div>
      <div className='flex flex-col gap-1 text-sm font-medium capitalize'>
        <label>Job title</label>
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          type='text '
          placeholder='Job title'
          className='rounded-md border bg-white border-slate-200 w-full p-2 outline-none placeholder:opacity-50'
          required
        />
      </div>
      <div className='flex flex-col gap-1 text-sm font-medium capitalize'>
        <label>Type</label>
        <select
          onChange={(e) => setType(e.target.value)}
          value={type}
          className='rounded-md text-sm border bg-white border-slate-200 w-full p-2 outline-none placeholder:opacity-50'
          required
        >
          <option value='' disabled>
            Select
          </option>
          <option value='Fulltime'>Fulltime</option>
          <option value='Part-time'>Part-time</option>
          <option value='Contract'>Contract</option>
        </select>
      </div>
      <div className='flex flex-col gap-1 text-sm font-medium capitalize'>
        <label>Mode</label>
        <select
          onChange={(e) => setMode(e.target.value)}
          value={mode}
          className='rounded-md text-sm border border-slate-200 w-full p-2 outline-none placeholder:opacity-50'
          required
        >
          <option value='' disabled>
            Select
          </option>
          <option value='Physical'>Physical</option>
          <option value='Hybrid'>Hybrid</option>
          <option value='Remote'>Remote</option>
        </select>
      </div>

      {mode !== "Remote" && (
        <div className='flex flex-col gap-1 text-sm font-medium capitalize'>
          <label>Location</label>
          <select
            onChange={(e) => setLocation(e.target.value)}
            value={location}
            className='rounded-md text-sm border border-slate-200 w-full p-2 outline-none placeholder:opacity-50'
          >
            <option value='' disabled>
              Select
            </option>
            {NigeriaStates.map((state) => (
              <option key={state} value={state.toLowerCase()}>
                {state}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        type='submit'
        className='rounded-md bg-orange-500 px-8 py-2 w-fit font-semibold text-white hover:bg-orange-700 duration-200 '
      >
        Post Job
      </button>
    </form>
  );
}
