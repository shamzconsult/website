"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EventAlert } from "../utils/login-alert";

export default function AddNewTestimonyForm() {
  const [image, setImage] = useState("");
  const [testimony, setTestimony] = useState("");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyTitle, setCompanyTitle] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!image || !name || !testimony || !companyName || !companyTitle) {
      return;
    }

    try {
      const res = await fetch("/api/testimonies", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          image,
          name,
          testimony,
          companyName,
          companyTitle,
        }),
      });
      if (res.ok) {
        EventAlert();
        router.push("/");
      } else {
        throw new Error("Event failed to add");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="font-medium text-2xl mb-3">Add new testimony</h1>
      <form
        onSubmit={handleSubmit}
        className=" flex flex-col  gap-6 p-10 rounded-md bg-slate-50 lg:w-[70%]"
      >
        <input
          onChange={(e) => setImage(e.target.value)}
          value={image}
          type="url"
          placeholder="https://cdn.hashnode.com/res/hashnode/image/upload/5432338f.jpeg"
          className="border border-slate-200 rounded-md w-full p-2 outline-none placeholder:opacity-50"
          required
        />
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text "
          placeholder="Name.."
          className="border border-slate-200 rounded-md w-full p-2 outline-none placeholder:opacity-50"
          required
        />
        <input
          onChange={(e) => setCompanyName(e.target.value)}
          value={companyName}
          type="text "
          placeholder="Shamzbridge consult"
          className="border border-slate-200 rounded-md w-full p-2 outline-none placeholder:opacity-50"
          required
        />
        <input
          onChange={(e) => setCompanyTitle(e.target.value)}
          value={companyTitle}
          type="text "
          placeholder="Program coordinator"
          className="border border-slate-200 rounded-md w-full p-2 outline-none placeholder:opacity-50"
          required
        />
        <textarea
          onChange={(e) => setTestimony(e.target.value)}
          value={testimony}
          rows={4}
          placeholder="Write testimony here.."
          className="border border-slate-200 rounded-md w-full p-2 outline-none placeholder:opacity-50"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 px-8 py-2 w-fit font-semibold text-white hover:bg-blue-700 duration-200 "
        >
          Add Testimony
        </button>
      </form>
    </div>
  );
}
