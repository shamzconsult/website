"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const Carousel = () => {
  const data = [
    {
      image:
        "https://cdn.hashnode.com/res/hashnode/image/upload/v1711867102709/c255d758-8bdf-47d2-ba00-0295f22165b1.jpeg",
    },
    {
      image:
        "https://cdn.hashnode.com/res/hashnode/image/upload/v1711867128461/14b36377-8dbf-40af-b3ff-ba1579b9e93d.jpeg",
    },
    {
      image:
        "https://cdn.hashnode.com/res/hashnode/image/upload/v1711867174771/e984c846-9579-48ea-ad27-95a376638edf.jpeg",
    },
    {
      image:
        "https://cdn.hashnode.com/res/hashnode/image/upload/v1711867200134/fbbba936-ff16-47c7-8d83-bb5d73667af4.jpeg",
    },
  ];

  // State and Ref initialization
  const [currentImg, setCurrentImg] = useState(0);
  const [carouselSize, setCarouselSize] = useState({ width: 0, height: 0 });
  const carouselRef = useRef(null);

  // useEffect to get the initial carousel size
  useEffect(() => {
    let elem = carouselRef.current as unknown as HTMLDivElement;
    let { width, height } = elem.getBoundingClientRect();
    if (carouselRef.current) {
      setCarouselSize({
        width,
        height,
      });
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center mt-6">
      {/* Carousel container */}
      <div className="w-[100%] h-[32rem] rounded-md overflow-hidden relative">
        {/* Image container */}
        <div
          ref={carouselRef}
          style={{
            left: -currentImg * carouselSize.width,
          }}
          className="w-full h-full absolute flex justify-center transition-all duration-300"
        >
          {/* Map through data to render images */}
          {data.map((v, i) => (
            <div key={i} className="relative shrink-0 w-full h-full ">
              <Image
                className="pointer-events-none object-cover "
                alt={`carousel-image-${i}`}
                fill
                src={
                  v.image ||
                  "https://cdn.hashnode.com/res/hashnode/image/upload/v1711867200134/fbbba936-ff16-47c7-8d83-bb5d73667af4.jpeg"
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-center mt-3">
        <button
          disabled={currentImg === 0}
          onClick={() => setCurrentImg((prev) => prev - 1)}
          className={`border px-4 py-2 font-bold ${
            currentImg === 0 && "opacity-50"
          }`}
        >
          {"<"}
        </button>
        <button
          disabled={currentImg === data.length - 1}
          onClick={() => setCurrentImg((prev) => prev + 1)}
          className={`border px-4 py-2 font-bold ${
            currentImg === data.length - 1 && "opacity-50"
          }`}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default Carousel;
