"use client";
import React from "react";
import { useEffect, useState } from "react";
import { testimonies } from "./testimonies";
import Image from "next/image";

const TestimonySlider = () => {
  const [currTestimony, setCurrTestimony] = useState(0);

  const clickNext = () => {
    currTestimony === testimonies.length - 1
      ? setCurrTestimony(0)
      : setCurrTestimony(currTestimony + 1);
  };
  const clickPrev = () => {
    currTestimony === 0
      ? setCurrTestimony(testimonies.length - 1)
      : setCurrTestimony(currTestimony - 1);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      clickNext();
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  }, [currTestimony]);
  return (
    <main className="flex flex-col justify-center items-center pt-20">
      <div className="relative block mx-auto border-2 border-gray-200 rounded bg-white ">
        {/* Testimonial */}
        {testimonies.map((data, idx) => (
          <div
            key={data.id}
            className={`${
              idx === currTestimony
                ? "text-center md:px-12 py-8 pt-20 mx-4 md:mx-0"
                : "hidden"
            }`}
          >
            <div className="absolute top-0 -mt-8 left-1/2 transform -translate-x-1/2">
              <svg
                className="absolute top-0 right-0 -mt-3 -mr-8 w-16 h-16 fill-current text-blue-500"
                viewBox="0 0 64 64"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M37.89 58.338c-2.648-5.63-3.572-10.045-2.774-13.249.8-3.203 8.711-13.383 23.737-30.538l2.135.532c-6.552 10.033-10.532 17.87-11.939 23.515-.583 2.34.22 6.158 2.41 11.457l-13.57 8.283zm-26.963-6.56c-2.648-5.63-3.572-10.046-2.773-13.25.799-3.203 8.71-13.382 23.736-30.538l2.136.533c-6.552 10.032-10.532 17.87-11.94 23.515-.583 2.339.22 6.158 2.41 11.456l-13.57 8.283z" />
              </svg>
              <Image
                className="relative rounded-full"
                src={data.testimonialImage}
                width={96}
                height={96}
                alt="Testimonial 01"
              />
            </div>
            <blockquote className="text-xl font-medium mb-4">
              “{data.testimony}“
            </blockquote>
            <cite className="block font-bold text-lg not-italic mb-1">
              {data.name}
            </cite>
            <div className="text-gray-600">
              <span>CEO & Founder</span>{" "}
              <a className="text-blue-600 hover:underline" href="#0">
                {data.company}
              </a>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          className="opacity-60 font-extrabold hover:opacity-100 duration-150"
          onClick={clickNext}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z"
            />
          </svg>
        </button>
        <button
          className="  opacity-60 font-extrabold hover:opacity-100 duration-150"
          onClick={clickPrev}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z"
            />
          </svg>
        </button>
      </div>
    </main>
  );
};

export default TestimonySlider;
