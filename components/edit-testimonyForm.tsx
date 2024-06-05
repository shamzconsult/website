"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "./ui/footer";

export default function EditTestimonyForm({
  _id,
  image,
  name,
  testimony,
  companyName,
  companyTitle,
}: any) {
  const [newImage, setNewImage] = useState(image);
  const [newName, setNewName] = useState(name);
  const [newTestimony, setNewTestimony] = useState(testimony);
  const [newCompanyName, setNewCompanyName] = useState(companyName);
  const [newCompanyTitle, setNewCompanyTitle] = useState(companyTitle);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (
      !newImage ||
      !newName ||
      !newTestimony ||
      !newCompanyName ||
      !newCompanyTitle
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/testimonies/${_id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          newImage,
          newName,
          newTestimony,
          newCompanyName,
          newCompanyTitle,
        }),
      });
      if (res.ok) {
        router.push("/");
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
        className="mb-32 flex flex-col gap-6  bg-slate-50 p-2 mx-auto w-[90%] lg:w-[60%]"
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
          onChange={(e) => setNewName(e.target.value)}
          value={newName}
          type="text "
          placeholder="Name.."
          className="border border-slate-400 focus:border-red-400 w-full p-2 outline-none placeholder:opacity-50"
          required
        />
        <textarea
          onChange={(e) => setNewTestimony(e.target.value)}
          value={newTestimony}
          rows={5}
          placeholder="Write testimony"
          className="border border-slate-400 focus:border-red-400 w-full p-2 outline-none placeholder:opacity-50"
          required
        />
        <input
          onChange={(e) => setNewCompanyName(e.target.value)}
          value={newCompanyName}
          type="text "
          placeholder="Company's Name"
          className="border border-slate-400 focus:border-red-400 w-full p-2 outline-none placeholder:opacity-50"
          required
        />
        <input
          onChange={(e) => setNewCompanyTitle(e.target.value)}
          value={newCompanyTitle}
          type="text"
          placeholder="Company title.. Head of office"
          className="border border-slate-400 focus:border-red-400 w-full p-2 outline-none placeholder:opacity-50"
          required
        />
        <button
          type="submit"
          className="bg-green-500 px-8 py-2 w-fit font-semibold text-white hover:bg-green-700 duration-200 "
        >
          Update Testimony
        </button>
      </form>
      <Footer />
    </div>
  );
}
