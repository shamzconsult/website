"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EventAlert } from "../utils/login-alert";
import { NigeriaStates } from "@/app/(site)/services/nigeriaStates";

export default function AddNewJobForm() {
  const [formId, setFormId] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [mode, setMode] = useState("");
  const [closing, setClosing] = useState("");
  const [location, setLocation] = useState("");
  const [requirements, setRequirements] = useState([""]);
  const [description, setDescription] = useState("");
  const router = useRouter();

  const addRequirement = () => {
    setRequirements([...requirements, ""]);
  };

  const removeRequirement = (index: number) => {
    if (requirements.length <= 1) return;
    const newRequirements = [...requirements];
    newRequirements.splice(index, 1);
    setRequirements(newRequirements);
  };

  const updateRequirement = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (
      !type ||
      !title ||
      !formId ||
      !mode ||
      (mode !== "Remote" && !location) ||
      !closing
    ) {
      return;
    }

    const filteredRequirements = requirements.filter(
      (req) => req.trim() !== ""
    );

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
          closing,
          location: mode === "Remote" ? "" : location,
          requirements: filteredRequirements,
          description,
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
      className="w-full flex flex-col justify-center gap-6 bg-slate-50 rounded-md p-10 lg:w-[70%]"
    >
      <div className="flex flex-col gap-1 text-sm font-medium capitalize">
        <label>Tally form Id</label>
        <input
          onChange={(e) => setFormId(e.target.value)}
          value={formId}
          type="text"
          placeholder="Tally form id"
          className="rounded-md border bg-white border-slate-200 w-full p-2 outline-none placeholder:opacity-50"
          required
        />
      </div>
      <div className="flex flex-col gap-1 text-sm font-medium capitalize">
        <label>Job title</label>
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          type="text "
          placeholder="Job title"
          className="rounded-md border bg-white border-slate-200 w-full p-2 outline-none placeholder:opacity-50"
          required
        />
      </div>
      <div className="flex flex-col gap-1 text-sm font-medium capitalize">
        <label>Type</label>
        <select
          onChange={(e) => setType(e.target.value)}
          value={type}
          className="rounded-md text-sm border bg-white border-slate-200 w-full p-2 outline-none placeholder:opacity-50"
          required
        >
          <option value="" disabled>
            Select
          </option>
          <option value="Fulltime">Fulltime</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
        </select>
      </div>

      <div className="flex flex-col gap-1 text-sm font-medium capitalize">
        <label>Mode</label>
        <select
          onChange={(e) => setMode(e.target.value)}
          value={mode}
          className="rounded-md text-sm border border-slate-200 w-full p-2 outline-none placeholder:opacity-50"
          required
        >
          <option value="" disabled>
            Select
          </option>
          <option value="Physical">Physical</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Remote">Remote</option>
        </select>
      </div>

      {mode !== "Remote" && (
        <div className="flex flex-col gap-1 text-sm font-medium capitalize">
          <label>Location</label>
          <select
            onChange={(e) => setLocation(e.target.value)}
            value={location}
            className="rounded-md text-sm border border-slate-200 w-full p-2 outline-none placeholder:opacity-50"
          >
            <option value="" disabled>
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

      <div className="flex flex-col gap-1 text-sm font-medium capitalize">
        <label>Description </label>
        <input
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          type="text"
          placeholder="Job Description"
          className="rounded-md border bg-white border-slate-200 w-full p-2 outline-none placeholder:opacity-50"
        />
      </div>

      <div className="flex flex-col gap-1 text-sm font-medium capitalize">
        <div className="flex justify-between items-center">
          <label>Requirements</label>
          <button
            type="button"
            onClick={addRequirement}
            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
          >
            Add Requirement
          </button>
        </div>

        {requirements.map((requirement, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              onChange={(e) => updateRequirement(index, e.target.value)}
              value={requirement}
              type="text"
              placeholder={`Requirement ${index + 1}`}
              className="flex-1 rounded-md border bg-white border-slate-200 p-2 outline-none placeholder:opacity-50"
            />
            <button
              type="button"
              onClick={() => removeRequirement(index)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
              disabled={requirements.length <= 1}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1 text-sm font-medium capitalize">
        <label>Deadline</label>
        <input
          onChange={(e) => setClosing(e.target.value)}
          value={closing}
          type="text"
          placeholder="Job deadline"
          className="rounded-md border bg-white border-slate-200 w-full p-2 outline-none placeholder:opacity-50"
          required
        />
      </div>

      <button
        type="submit"
        className="rounded-md bg-orange-500 px-8 py-2 w-fit font-semibold text-white hover:bg-orange-700 duration-200 "
      >
        Post Job
      </button>
    </form>
  );
}
