// import ServiceNumber from "./service-numbers";

import { ServiceNumber } from "./service-numbers";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightDots, faHandshake, faHelmetSafety } from '@fortawesome/free-solid-svg-icons';

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
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="w-16 h-16 -mt-1 text-orange-500  p-4 " viewBox="0 0 16 16">
                  <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514"/>
                  <path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6.5a.5.5 0 0 1-1 0V1H3v14h3v-2.5a.5.5 0 0 1 .5-.5H8v4H3a1 1 0 0 1-1-1z"/>
                  <path d="M4.5 2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm3 0a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm3 0a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm-6 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm3 0a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm3 0a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm-6 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm3 0a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"/>
                </svg>
              </div>

              <h4 className="text-xl font-bold text-center leading-snug tracking-tight mb-1 text-orange-600">
                Programs/Projects Management
              </h4>
              <p className="text-gray-600 text-center">
                Partner with us for seamless project execution.
              </p>
            </div>

            {/* 2nd item */}
            <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl hover:scale-105 hover:-translate-y-2 hover:shadow-xl duration-500">
            <div className="bg-slate-200 rounded-full">
              <FontAwesomeIcon icon={faArrowUpRightDots} className="w-16 h-16 -mt-1 text-orange-500  p-4 " />
            </div>

              
              <h4 className="text-xl font-bold leading-snug mt-2 tracking-tight mb-1 text-orange-600">
                Capacity Building
              </h4>
              <p className="text-gray-600 text-center">
                Nurture talent and skills with our capacity building services
              </p>
            </div>

            {/* 3rd item */}
            <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl hover:scale-105 hover:-translate-y-2 hover:shadow-xl duration-500">
              <div className="bg-slate-200 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="w-16 h-16 -mt-1 text-orange-500  p-4 " viewBox="0 0 16 16">
                  <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m.256 7a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1zm3.63-4.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"/>
                </svg>
              </div>

              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1 text-orange-600">
                Consultancy Services
              </h4>
              <p className="text-gray-600 text-center">
                Elevate your strategy with our consultancy services
              </p>
            </div>

            {/* 4th item */}
            <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl hover:scale-105 hover:-translate-y-2 hover:shadow-xl duration-500">
              <div className="bg-slate-200 rounded-full">
              
              <FontAwesomeIcon icon={faHelmetSafety} className="w-16 h-16 -mt-1 text-orange-500  p-4 " />              
              </div>
              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1 text-orange-600">
                Event Host/Management
              </h4>
              <p className="text-gray-600 text-center">
                Let us handle the details while you enjoy the moment.
              </p>
            </div>

            {/* 5th item */}
            <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl hover:scale-105 hover:-translate-y-2 hover:shadow-xl duration-500">
              <div className="bg-slate-200 rounded-full">
              
              <FontAwesomeIcon icon={faHandshake} className="w-16 h-16 -mt-1 text-orange-500  p-4 " />
              </div>
              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1 text-orange-600">
                Community Development
              </h4>
              <p className="text-gray-600 text-center">
                Championing development where it matters most
              </p>
            </div>

            {/* 6th item */}
            <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl hover:scale-105 hover:-translate-y-2 hover:shadow-xl duration-500">
              
              <div className="bg-slate-200 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="w-16 h-16 -mt-1 text-orange-500  p-4 " viewBox="0 0 16 16">
                  <path d="M6 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0M1 3a2 2 0 1 0 4 0 2 2 0 0 0-4 0"/>
                  <path d="M9 6h.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 7.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 16H2a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm6 8.73V7.27l-3.5 1.555v4.35zM1 8v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1"/>
                  <path d="M9 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6M7 3a2 2 0 1 1 4 0 2 2 0 0 1-4 0"/>
                </svg>
              </div>

              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1 text-orange-600">
                Content Development
              </h4>
              <p className="text-gray-600 text-center">
                Unleash your creativity and transform ideas into impactful
                stories
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
