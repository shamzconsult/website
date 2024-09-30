import React from "react";
import { getAllJob } from "@/app/services/careerService";
import Footer from "./ui/footer";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface JobType {
  title: string;
  mode: string;
  location: string;
  type: string;
  _id: number;
  isActive: boolean;
  formId: string;
  createdAt: string;
}

export default async function HiringAdvert() {
  const data = await getAllJob();
  const jobs: JobType[] = data.jobs || [];

  return (
    <>
      <section className='min-h-screen max-w-6xl mx-auto px-4 sm:px-6 mb-8'>
        <h1 className='font-bold mb-6 text-lg px-2 text-slate-800'>Careers</h1>
        <section className='flex flex-col gap-4 w-full'>
          {jobs.length > 0 ? (
            jobs.map(
              ({
                title,
                mode,
                location,
                type,
                _id,
                isActive,
                formId,
                createdAt,
              }) => (
                <div
                  key={_id}
                  className='bg-slate-100 hover:bg-slate-100/80 p-[24px] rounded-[12px] min-[450px]:flex justify-between items-center text-center min-[450px]:text-left'
                >
                  <div className='flex flex-col gap-1'>
                    <div className='flex flex-col gap-2'>
                      <p className='font-medium text-slate-700 font-sans'>
                        {title}
                      </p>
                      <ul className='text-sm flex gap-8 list-disc px-4 justify-center min-[450px]:justify-start text-slate-500'>
                        <li className='font-medium marker:text-orange-500'>
                          {type}
                        </li>
                        <li className='font-medium marker:text-blue-500'>
                          {mode}
                        </li>
                        {mode !== "Remote" && (
                          <li className='font-medium marker:text-orange-500'>
                            {location}
                          </li>
                        )}
                      </ul>
                    </div>
                    <time className='text-sm text-slate-400'>
                      {dayjs(createdAt).fromNow()}
                    </time>
                  </div>
                  {isActive ? (
                    <div className='flex justify-center items-center mt-3 min-[450px]:mt-0'>
                      <button
                        data-tally-open={formId}
                        data-tally-layout='modal'
                        data-tally-width='700'
                        data-tally-emoji-text='👋'
                        data-tally-emoji-animation='wave'
                        className='rounded-full px-2 py-3 w-28 text-sm bg-orange-600 text-slate-50 hover:bg-orange-500 duration-200 font-semibold'
                      >
                        Apply Now
                      </button>
                    </div>
                  ) : (
                    <div className='flex justify-center items-center mt-8'>
                      <Link href={`/hiring/${_id}`}>
                        <button className='rounded-full px-2 py-3 w-28 bg-slate-400 cursor-not-allowed text-white duration-200 font-medium'>
                          Closed
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              )
            )
          ) : (
            <div className='text-gray-500'></div>
          )}
        </section>
      </section>
      <Footer />
    </>
  );
}
