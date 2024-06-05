"use client";

import AddNewTestimonyForm from "@/components/addNew-testimonyForm";
import AllTestimonies from "@/components/all-testimonies";

export default function AddNewTestimony() {
  return (
    <div className="mt-32 ">
      <AddNewTestimonyForm />
      <AllTestimonies />
    </div>
  );
}
