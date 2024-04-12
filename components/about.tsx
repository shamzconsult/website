"use client";
import { useState } from "react";

export default function AboutUs() {
  const [showMore, setShowMore] = useState(false);
  return (
    <div id="about" className="max-w-5xl mx-auto text-center py-12  mt-6">
      <h2 className="h2 mb-4 text-orange-600">About Us</h2>
      <div className="flex flex-col gap-4 px-2">
        <p className="text-gray-600 text-lg">
          Our journey began with a simple yet ambitious goal: to provide service
          beyond compare. Over the years, we have evolved and grown, expanding
          our offerings to meet the diverse needs of our clients. From tailored
          solutions to comprehensive consultations, we leverage our extensive
          knowledge and experience to drive transformative change and help our
          clients succeed in today's dynamic business environment.
        </p>

        {showMore ? (
          <p className="text-gray-600 text-lg">
            What sets us apart is our commitment to understanding our clients'
            unique challenges and goals. We take a collaborative approach,
            working closely with each client to develop customized strategies
            that address their specific needs and objectives. Our team of
            seasoned professionals brings together a wealth of expertise from
            various industries, ensuring that we can provide insights and
            solutions that are both innovative and effective.
          </p>
        ) : null}

        <button
          onClick={() => setShowMore((prevVisibility) => !prevVisibility)}
          className="text-sm hover:underline"
        >
          {showMore ? "Show less" : "Show more"}
        </button>
      </div>
    </div>
  );
}
