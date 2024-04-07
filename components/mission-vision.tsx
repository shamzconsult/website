"use client";

export default function Mission() {
  return (
    <section className='relative'>
      <div
        className='absolute inset-0 bg-gray-100 pointer-events-none mb-16'
        aria-hidden='true'
      ></div>
      <div className='absolute left-0 right-0 m-auto w-px p-px h-20 bg-gray-200 transform -translate-y-1/2'></div>

      <div className='relative max-w-6xl mx-auto px-4 sm:px-6'>
        <div className='pt-12 md:pt-20'>
          {/* Section header */}
          <div className='max-w-3xl mx-auto text-center pb-12 md:pb-16'>
            <h1 className='h2 mb-4 text-orange-600'>Our Vision and Mission </h1>
            <p className='text-xl text-gray-600'>
              Redefining industry standards through consultation, our innovative
              approach integrates cutting-edge technology with expert insights,
              driving transformative change and setting new benchmarks for
              excellence.
            </p>
          </div>
          <section className='flex flex-col gap-4 justify-center items-center lg:flex-row w-[100%]'>
            <div
              className={`lg:w-[50%] lg:h-60 bg-white shadow-md border-gray-200 hover:shadow-lg flex flex-col items-center text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 `}
            >
              <div className='flex flex-col gap-1 items-center'>
                <div className='font-bold leading-snug tracking-tight mb-1'>
                  Vision:
                </div>
                <div className='text-gray-600 text-center'>
                  To become a premier organization dedicated to enhancing both
                  personal and professional capacities of individuals and
                  businesses, fostering efficiency, heightened productivity, and
                  innovation.
                </div>
              </div>
            </div>
            <div
              className={`lg:w-[50%] lg:h-60 bg-white shadow-md border-gray-200 hover:shadow-lg flex flex-col items-center text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 `}
            >
              <div className='flex flex-col gap-1 text-center'>
                <div className='font-bold leading-snug tracking-tight mb-1'>
                  Mission
                </div>
                <div className='text-gray-600'>
                  Our mission is to cultivate an empowering atmosphere for skill
                  acquisition and capacity enhancement, benefiting both
                  organizations and individuals. This commitment facilitates
                  holistic growth, development, and empowerment for all who
                  engage with us.
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
