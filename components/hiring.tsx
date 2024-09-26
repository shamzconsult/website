"use client";
import { useEffect, useState } from "react";
import Footer from "./ui/footer";
import Link from "next/link";

interface JobType {
  title: string;
  mode: string;
  location: string;
  type: string;
  _id: number;
  isActive: boolean;
  formId: string;
}

export const getAllJob = async () => {
  try {
    const res = await fetch("/api/career", {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Error found while fetching");
    }
    return res.json();
  } catch (error) {
    console.log("Error loading data", error);
  }
};

const HiringAdvert = () => {
  const [jobs, setJobs] = useState<JobType[]>([]);

  const fetchData = async () => {
    try {
      const data = await getAllJob();
      setJobs(data.jobs);
    } catch (error) {
      console.log("Error loading data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <section className='min-h-screen max-w-6xl mx-auto px-4 sm:px-6 text-gray-600 mb-8'>
        <h1 className='font-bold mb-6 text-lg px-2'>Roles</h1>
        <section className='flex flex-col gap-4 w-full'>
          {jobs.length > 0 ? (
            jobs.map(({ title, mode, location, type, _id, isActive, formId }) => (
              <div
                key={_id}
                className="bg-slate-100 p-[24px] rounded-[12px] md:flex justify-between items-center"
              >
                <div className="flex flex-col gap-1">
                  <p className="font-medium">{title}</p>
                  <ul className="text-sm flex gap-8 text-gray-400 list-disc px-4">
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
                  {isActive ? (
                    <div className='flex justify-center mt-8'>
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
            <div className='text-red-200'>No jobs available...</div>
          )}
        </section>
      </section>
      <Footer />
    </>
  );
};

export default HiringAdvert;
