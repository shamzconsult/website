// import ServiceNumber from "./service-numbers";

import { ServiceNumber } from "./service-numbers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightDots,
  faHandshake,
  faHelmetSafety,
  faMicrophoneAlt,
  faUsersGear,
  faVideoCamera,
} from "@fortawesome/free-solid-svg-icons";

export default function Services() {
  return (
    <section id="service" className="bg-slate-50">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 ">
        <div className="py-12 md:py-20 flex flex-col items-center justify-center">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h2 className="h2 mb-4 text-orange-600">Our Services</h2>
            <p className="text-xl text-gray-600">
              Explore our diverse offerings and experience unparalleled
              excellence from tailored solutions to personalized consultations.
            </p>
          </div>

          {/* Items */}
          <div className="max-w-sm mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3 md:max-w-2xl items-center justify-center  lg:max-w-none">
            {/* 1st item */}
            <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl  hover:scale-105 hover:-translate-y-2 hover:shadow-xl duration-500">
              <div className="bg-slate-200 rounded-full">
                <FontAwesomeIcon
                  icon={faHelmetSafety}
                  className="w-16 h-16 -mt-1 text-orange-500 p-4 "
                />
              </div>
              <h4 className="text-xl font-bold text-center leading-snug tracking-tight mb-1 text-orange-600">
                Programs/Projects Management
              </h4>
              <p className="text-gray-600 text-center">
                Partner with us for seamless project execution.
              </p>
            </div>

            {/* 2nd item */}
            <div className="relative flex flex-col items-center p-8 bg-white rounded shadow-xl hover:scale-105 hover:-translate-y-2 hover:shadow-xl duration-500">
              <div className="bg-slate-200 rounded-full mb-2">
                <FontAwesomeIcon
                  icon={faArrowUpRightDots}
                  className="w-16 h-16 -mt-1 text-orange-500  p-4 "
                />
              </div>
              <h4 className="text-xl font-bold leading-snug mt-2 tracking-tight mb-1 text-orange-600">
                Capacity Building
              </h4>
              <p className="text-gray-600 text-center">
                Nurture talent and skills with our capacity building services.
              </p>
            </div>

            {/* 3rd item */}
            <div className="relative flex flex-col items-center p-8 bg-white rounded shadow-xl hover:scale-105 hover:-translate-y-2 hover:shadow-xl duration-500">
              <div className="bg-slate-200 rounded-full mb-2">
                <FontAwesomeIcon
                  icon={faUsersGear}
                  className="w-16 h-16 -mt-1 text-orange-500  p-4 "
                />
              </div>
              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1 text-orange-600">
                Consultancy Services
              </h4>
              <p className="text-gray-600 text-center">
                Elevate your strategy with our consultancy services.
              </p>
            </div>

            {/* 4th item */}
            <div className="relative flex flex-col items-center p-8 bg-white rounded shadow-xl hover:scale-105 hover:-translate-y-2 hover:shadow-xl duration-500">
              <div className="bg-slate-200 rounded-full mb-2">
                <FontAwesomeIcon
                  icon={faMicrophoneAlt}
                  className="w-16 h-16 -mt-1 text-orange-500 p-4 "
                />
              </div>
              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1 text-orange-600">
                Event Host/Management
              </h4>
              <p className="text-gray-600 text-center">
                Let us handle the details while you enjoy the moment.
              </p>
            </div>

            {/* 5th item */}
            <div className="relative flex flex-col items-center p-8 bg-white rounded shadow-xl hover:scale-105 hover:-translate-y-2 hover:shadow-xl duration-500">
              <div className="bg-slate-200 rounded-full mb-2">
                <FontAwesomeIcon
                  icon={faHandshake}
                  className="w-16 h-16 -mt-1 text-orange-500  p-4 "
                />
              </div>
              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1 text-orange-600">
                Community Development
              </h4>
              <p className="text-gray-600 text-center">
                Championing development where it matters most.
              </p>
            </div>

            {/* 6th item */}
            <div className="relative flex flex-col items-center p-8 bg-white rounded shadow-xl hover:scale-105 hover:-translate-y-2 hover:shadow-xl duration-500">
              <div className="bg-slate-200 rounded-full mb-2">
                <FontAwesomeIcon
                  icon={faVideoCamera}
                  className="w-16 h-16 -mt-1 text-orange-500  p-4 "
                />
              </div>

              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1 text-orange-600">
                Content Development
              </h4>
              <p className="text-gray-600 text-center">
                Unleash your creativity and transform ideas into impactful
                stories.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
