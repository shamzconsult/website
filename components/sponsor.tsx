import React from "react";
import Marquee from "react-fast-marquee";
import { sponsors } from "../constant/sponsor";

const Sponsors = () => {
  return (
    <section className="">
      <Marquee speed={100} pauseOnHover={true}>
        {sponsors?.map((sponsor) => (
          <div key={sponsor?.id}>
            <div className="min-w-[100px] min-h-[100px] bg-white shadow rounded sm:min-w-[300px] max-w-[300px] sm:min-h-[200px] max-h-[200px] flex justify-center items-center mx-4 drop-shadow-sm">
              <img
                src={sponsor?.src}
                alt={sponsor?.alt}
                className="w-fit h-32"
              />
            </div>
            <h3 className="text-12 font-semibold text-center mt-3">
              {sponsor?.name}
            </h3>
          </div>
        ))}
      </Marquee>
    </section>
  );
};

export default Sponsors;
