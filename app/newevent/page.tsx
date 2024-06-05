"use client";
import AllEvents from "@/components/all-events";
import NewEvents from "@/components/new-events";
import Link from "next/link";

export default function AddNewEvent() {
  return (
    <div className="mt-32 ">
      <Link href={"/testimonies"}>
        <button className="flex justify-end items-end border border-orange-300 rounded-md px-3 hover:border-orange-600 mx-16">
          Click here to add new testimonies
        </button>
      </Link>
      <NewEvents />
      <AllEvents />
    </div>
  );
}
