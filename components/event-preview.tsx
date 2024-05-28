"use client";

import { useParams } from "next/navigation";

const EventPreview = () => {
  const _id = useParams();

  console.log(_id);
  return <div className="mt-32">Hello</div>;
};

export default EventPreview;
