"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EventAlert } from "../utils/login-alert";
import { FileIcon } from "@radix-ui/react-icons";

export default function AddNewEventForm() {
  const [image, setImage] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const router = useRouter();

  const handleFiles = (files: FileList) => {
    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setGallery((prev) => [...prev, ...newImages]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

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
          gallery,
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
      <div className="flex items-center gap-4">
        <label
          htmlFor="gallery-upload"
          className="flex items-center gap-2 cursor-pointer text-blue-500 hover:underline"
        >
          <FileIcon className="w-6 h-6" />
          <span>Upload Gallery Images</span>
        </label>
        <input
          id="gallery-upload"
          type="file"
          accept="image/png, image/gif, image/jpeg"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {gallery.length > 0 && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-6 gap-2 justify-start  mt-4">
          {gallery.map((img, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <img
                src={img}
                alt="image"
                className="w-24 h-24 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() =>
                  setGallery(gallery.filter((_, i) => i !== index))
                }
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        type="submit"
        className="rounded-md bg-orange-500 px-8 py-2 w-fit font-semibold text-white hover:bg-orange-700 duration-200 "
      >
        Add Event
      </button>
    </form>
  );
}
