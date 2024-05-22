import Link from "next/link";
import TestimonySlider from "./testimonials/testimony-slider";
import Newsletter from "./newsletter";

export default function Partners() {
  return (
    <section className="relative">
      {/* Illustration behind content */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none -mb-32"
        aria-hidden="true"
      >
        <svg
          width="1760"
          height="518"
          viewBox="0 0 1760 518"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              x1="50%"
              y1="0%"
              x2="50%"
              y2="100%"
              id="illustration-02"
            >
              <stop stopColor="#FFF" offset="0%" />
              <stop stopColor="#EAEAEA" offset="77.402%" />
              <stop stopColor="#DFDFDF" offset="100%" />
            </linearGradient>
          </defs>
          <g
            transform="translate(0 -3)"
            fill="url(#illustration-02)"
            fillRule="evenodd"
          >
            <circle cx="1630" cy="128" r="128" />
            <circle cx="178" cy="481" r="40" />
          </g>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div
            id="partner"
            className="max-w-3xl mx-auto text-center pb-12 md:pb-16"
          >
            <h2 className="h2 mb-4 text-orange-600">
              Organizations who trust us
            </h2>
            <p className="text-xl text-gray-600" data-aos="zoom-y-out">
              Discover the Diverse Range of Organizations Who Trust Us for
              Unmatched Excellence. From global enterprises to local businesses,
              our commitment to delivering exceptional service has earned us the
              trust of clients across various industries.
            </p>
          </div>

          {/* Items */}
          <div className="flex flex-wrap justify-center items-center gap-6 font-bold  text-2xl">
            {/* Item */}
            <Link
              href=""
              className="flex items-center justify-center py-2 col-span-2 md:col-auto opacity-60 hover:opacity-100 cursor-pointer text-center"
            >
              •Kwara state Government•
            </Link>

            {/* Item */}
            <Link
              href=""
              className="flex items-center justify-center py-2 col-span-2 md:col-auto opacity-60 hover:opacity-100 cursor-pointer text-center"
            >
              •National Productivity Center•
            </Link>

            {/* Item */}
            <Link
              href=""
              className="flex items-center justify-center py-2 col-span-2 md:col-auto opacity-60 hover:opacity-100 cursor-pointer text-center"
            >
              •KSolutions•
            </Link>

            {/* Item */}
            <Link
              href=""
              className="flex items-center justify-center py-2 col-span-2 md:col-auto opacity-60 hover:opacity-100 cursor-pointer text-center"
            >
              •Kanon Royal Consult•
            </Link>

            {/* Item */}
            <Link
              href=""
              className="flex items-center justify-center py-2 col-span-2 md:col-auto opacity-60 hover:opacity-100 cursor-pointer col-start-2 col-end-4 text-center"
            >
              •Nigeria Employers Consultative Association•
            </Link>
            <Link
              href=""
              className="flex items-center justify-center py-2 col-span-2 md:col-auto opacity-60 hover:opacity-100 cursor-pointer col-start-2 col-end-4 text-center"
            >
              •Kwara state College of Education•
            </Link>
            <Link
              href=""
              className="flex items-center justify-center py-2 col-span-2 md:col-auto opacity-60 hover:opacity-100 cursor-pointer col-start-2 col-end-4 text-center"
            >
              •Students Union, University of Ilorin•
            </Link>
            <Link
              href=""
              className="flex items-center justify-center py-2 col-span-2 md:col-auto opacity-60 hover:opacity-100 cursor-pointer col-start-2 col-end-4 text-center"
            >
              •Postgraduate Students' Association, University of Ilorin•
            </Link>
          </div>

          {/* Testimonials */}
          <div
            id="testimonial"
            className="max-w-3xl mx-auto mt-20"
            data-aos="zoom-y-out"
          >
            <TestimonySlider />
          </div>
        </div>
        <Newsletter />
      </div>
    </section>
  );
}
