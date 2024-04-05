"use client";

import { useState, useRef, useEffect } from "react";
import { Transition } from "@headlessui/react";
import Image from "next/image";
import FeaturesBg from "@/public/images/features-bg.png";
import FeaturesElement from "@/public/images/features-element.png";

export default function Features() {
  const [tab, setTab] = useState<number>(1);

  const tabs = useRef<HTMLDivElement>(null);

  const heightFix = () => {
    if (tabs.current && tabs.current.parentElement)
      tabs.current.parentElement.style.height = `${tabs.current.clientHeight}px`;
  };

  useEffect(() => {
    heightFix();
  }, []);

  return (
    <section className="relative">
      {/* Section background (needs .relative class on parent and next sibling elements) */}
      <div
        className="absolute inset-0 bg-gray-100 pointer-events-none mb-16"
        aria-hidden="true"
      ></div>
      <div className="absolute left-0 right-0 m-auto w-px p-px h-20 bg-gray-200 transform -translate-y-1/2"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-12 md:pt-20">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <h1 className="h2 mb-4">Our Vision and Mission </h1>
            <p className="text-xl text-gray-600">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur excepteur sint occaecat
              cupidatat.
            </p>
          </div>
          <section className="flex flex-col gap-4 justify-center items-center lg:flex-row w-[100%]">
            <div
              className={`lg:w-[50%] h-60 bg-white shadow-md border-gray-200 hover:shadow-lg flex flex-col items-center text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 `}
            >
              <div className="flex flex-col gap-1 items-center">
                <div className="font-bold leading-snug tracking-tight mb-1">
                  Vision:
                </div>
                <div className="text-gray-600 text-center">
                  To become a premier organization dedicated to enhancing both
                  personal and professional capacities of individuals and
                  businesses, fostering efficiency, heightened productivity, and
                  innovation.
                </div>
              </div>
              <div className="flex justify-center items-center w-8 h-8 bg-white rounded-full shadow flex-shrink-0 ml-3">
                <svg
                  className="w-3 h-3 fill-current"
                  viewBox="0 0 12 12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11.953 4.29a.5.5 0 00-.454-.292H6.14L6.984.62A.5.5 0 006.12.173l-6 7a.5.5 0 00.379.825h5.359l-.844 3.38a.5.5 0 00.864.445l6-7a.5.5 0 00.075-.534z" />
                </svg>
              </div>
            </div>
            <div
              className={`lg:w-[50%] h-60 bg-white shadow-md border-gray-200 hover:shadow-lg flex flex-col items-center text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 `}
            >
              <div className="flex flex-col gap-1 text-center">
                <div className="font-bold leading-snug tracking-tight mb-1">
                  Mission
                </div>
                <div className="text-gray-600">
                  Our mission is to cultivate an empowering atmosphere for skill
                  acquisition and capacity enhancement, benefiting both
                  organizations and individuals. This commitment facilitates
                  holistic growth, development, and empowerment for all who
                  engage with us.
                </div>
              </div>
              <div className="flex justify-center items-center w-8 h-8 bg-white rounded-full shadow flex-shrink-0 ml-3">
                <svg
                  className="w-3 h-3 fill-current"
                  viewBox="0 0 12 12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11.953 4.29a.5.5 0 00-.454-.292H6.14L6.984.62A.5.5 0 006.12.173l-6 7a.5.5 0 00.379.825h5.359l-.844 3.38a.5.5 0 00.864.445l6-7a.5.5 0 00.075-.534z" />
                </svg>
              </div>
            </div>
          </section>

          {/* Section content */}
        </div>
      </div>
    </section>
  );
}
