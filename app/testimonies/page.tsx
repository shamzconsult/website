"use client";

import AddNewTestimonyForm from "@/components/addNew-testimonyForm";
import AllTestimonies from "@/components/all-testimonies";

export default function AddNewTestimony() {
  return (
    <div className='mt-32 mx-auto w-[90%] lg:w-[60%] p-10'>
      <AddNewTestimonyForm />
      <AllTestimonies />
    </div>
  );
}
