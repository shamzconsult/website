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
  closing: string;
  formId: string;
  createdAt: string;
}

export default async function HiringAdvert() {
  const data = await getAllJob();
  const jobs: JobType[] = data.jobs || [];
  const totalJobs = jobs.length;

  return (
    <>
      <section className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 mb-8">
        <div className="mt-1 text-center mb-8 sm:mb-0 sm:text-right ">
          <a
            href="mailto:shamzbridgeconsult@gmail.com?subject=Contacting%20you%20about%20hiring%20service%20with%20Shamzbridge&body=Hi, %0D%0A%0D%0A"
            target="_blank"
            rel="noopener"
            className="text-sm bg-orange-500 p-4 rounded-lg text-white font-medium hover:bg-orange-700"
          >
            Want to hire? Contact us
          </a>
        </div>

        <div>
          <h1 className="font-bold text-2xl px-2 text-center text-slate-800 mb-6 sm:text-left ">
            Careers ({totalJobs})
          </h1>
          <section className="flex flex-col gap-4 w-full">
            {jobs.length > 0 ? (
              jobs.map(
                ({
                  title,
                  mode,
                  location,
                  type,
                  _id,
                  isActive,
                  closing,
                  formId,
                  createdAt,
                }) => (
                  <div
                    key={_id}
                    className="bg-slate-100 hover:bg-slate-100/80 p-[24px] rounded-[12px] min-[450px]:flex justify-between items-center text-center min-[450px]:text-left"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-col gap-2">
                        <p className="font-medium md:text-2xl text-slate-700 font-sans">
                          {title}
                        </p>
                        <ul className="text-sm mb-6 sm:mb-4 flex gap-8 list-disc px-4 justify-center min-[450px]:justify-start text-slate-500">
                          <li className="font-medium md:text-lg marker:text-orange-500">
                            {type}
                          </li>
                          <li className="font-medium md:text-lg marker:text-blue-500">
                            {mode}
                          </li>
                          {mode !== "Remote" && (
                            <li className="font-medium md:text-lg marker:text-orange-500 capitalize">
                              {location}
                            </li>
                          )}
                        </ul>
                      </div>
                      <div className="flex justify-center gap-10 sm:justify-start">
                        <div className="flex flex-col items-center text-sm text-slate-400 sm:flex-row ">
                          <span className="mr-3 w-1.5 h-1.5 bg-orange-500 rounded-full hidden sm:flex"></span>
                          <time>Posted:</time>
                          <time>{dayjs(createdAt).fromNow()}</time>
                        </div>
                        {isActive && closing ? (
                          <div className="flex flex-col items-center text-sm text-slate-400 sm:flex-row">
                            <span className="mr-3 w-1.5 h-1.5 bg-blue-500 rounded-full hidden sm:flex"></span>
                            <p>Deadline:</p>
                            <p>{closing} </p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex justify-center items-center mt-3 min-[450px]:mt-0">
                      {isActive ? (
                        <button
                          data-tally-open={formId}
                          data-tally-layout="modal"
                          data-tally-width="700"
                          data-tally-emoji-text="👋"
                          data-tally-emoji-animation="wave"
                          className="rounded-full px-2 py-3 w-28 text-sm bg-orange-600 text-slate-50 hover:bg-orange-500 duration-200 font-semibold"
                        >
                          Apply Now
                        </button>
                      ) : (
                        <button
                          title="Application closed."
                          disabled
                          className="rounded-full px-2 py-3 w-28 bg-slate-400 cursor-not-allowed text-white duration-200 font-medium"
                        >
                          Closed
                        </button>
                      )}
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="text-gray-500"></div>
            )}
          </section>
        </div>
      </section>
      <Footer />
    </>
  );
}
