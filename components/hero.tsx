"use client";
import ContactUs from "@/components/contact/contact-us";
import { FlipWords } from "./ui/flip-words";

export default function Hero() {
  const words = ["transferable skills", "rewarding skills"];
  return (
    <section className='relative'>
      <div
        className='absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none -z-1'
        aria-hidden='true'
      >
        <svg
          width='1360'
          height='578'
          viewBox='0 0 1360 578'
          xmlns='http://www.w3.org/2000/svg'
        >
          <defs>
            <linearGradient
              x1='50%'
              y1='0%'
              x2='50%'
              y2='100%'
              id='illustration-01'
            >
              <stop stopColor='#FFF' offset='0%' />
              <stop stopColor='#EAEAEA' offset='77.402%' />
              <stop stopColor='#DFDFDF' offset='100%' />
            </linearGradient>
          </defs>
          <g fill='url(#illustration-01)' fillRule='evenodd'>
            <circle cx='1232' cy='128' r='128' />
            <circle cx='155' cy='443' r='64' />
          </g>
        </svg>
      </div>

      <div className='max-w-4xl mx-auto px-4 sm:px-6'>
        {/* Hero content */}
        <div className='pt-32 pb-12 md:pt-40 md:pb-20'>
          {/* Section header */}
          <div className='text-center pb-12 md:pb-16'>
            <h1
              className='text-3xl sm:text-2xl md:text-4xl font-extrabold leading-snug tracking-tighter mb-4'
              data-aos='zoom-y-out'
            >
              <p>Build an Organization of High Repute,</p>
              <div className='sm:flex sm:items-center sm:gap-2 sm:justify-center'>
                <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400'>
                  Immerse yourself in{" "}
                </span>
                <span className='block sm:inline-flex flex-col h-[calc(theme(fontSize.3xl)*theme(lineHeight.tight))] sm:h-[calc(theme(fontSize.2xl)*theme(lineHeight.tight))]  md:h-[calc(theme(fontSize.4xl)*theme(lineHeight.tight))] overflow-hidden'>
                  <ul className='block animate-text-slide-3 text-center sm:text-left leading-tight [&_li]:block'>
                    <li>Transferable skills</li>
                    <li>In-Demand skills</li>
                    <li>Marketable skillset</li>
                    <li aria-hidden='true'>Transferable skills</li>
                  </ul>
                </span>{" "}
              </div>
              <span className='sm:block bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400'>
                for Self Sustenance
              </span>
            </h1>
            <div className='max-w-3xl mx-auto'>
              {/* <p
                className='text-xl text-gray-600 mb-8'
                data-aos='zoom-y-out'
                data-aos-delay='150'
              >
                Ask Us How.
              </p> */}
              <div
                className='max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center'
                data-aos='zoom-y-out'
                data-aos-delay='300'
              >
                <ContactUs />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
