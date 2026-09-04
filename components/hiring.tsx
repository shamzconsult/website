"use client";

import { getAllJob } from "@/app/(site)/services/careerService";
import Footer from "./ui/footer";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ContactButton from "./ContactButton";
import { useEffect, useState } from "react";

dayjs.extend(relativeTime);

export type JobType = {
  title: string;
  mode: string;
  location: string;
  type: string;
  _id: number;
  isActive: boolean;
  closing: string;
  formId: string;
  createdAt: string;
  requirements: string[];
  description: string;
};

export default function HiringAdvert() {
  const [isVisible, setIsVisible] = useState(false);
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllJob();
        setJobs(data.jobs || []);
        setTotalJobs(data.jobs?.length || 0);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    setIsVisible(true);
  }, []);

  return (
    <>
      {/* Hero section */}
      <section
        className="relative min-h-[70vh] flex items-center justify-center bg-cover bg-center bg-no-repeat text-white"
        style={{ backgroundImage: "url('/careerhero.jpg')" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/75"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className={`font-serif text-3xl md:text-5xl font-bold mb-6 transition-all duration-700 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Join Our Team
          </h1>
          <p
            className={`md:text-xl  max-w-3xl mx-auto transition-all duration-700 delay-500 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Be part of a mission-driven organization that creates lasting
            positive impact in communities worldwide. Build your career while
            building a better future.
          </p>
        </div>
      </section>

      <section className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 mb-8">
        <div>
          {!loading && (
            <h1 className="font-bold text-2xl px-2 text-center text-slate-800 mb-6 sm:text-left mt-4">
              Careers ({totalJobs})
            </h1>
          )}

          <section className="flex flex-col gap-4 w-full">
            {loading ? (
              <div className="flex flex-col justify-center items-center py-20">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <p>Loading...</p>
              </div>
            ) : jobs.length > 0 ? (
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
                  description = "",
                  requirements,
                }) => (
                  <div
                    key={_id}
                    className="bg-slate-100 hover:bg-slate-100/80 p-[24px] rounded-[12px] min-[450px]:flex justify-between items-start  min-[450px]:text-left"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-col gap-2">
                        <p className="font-medium md:text-2xl text-slate-700 font-sans">
                          {title}
                        </p>
                        <ul className="text-sm mb-6 sm:mb-4 flex gap-8 list-disc px-4  min-[450px]:justify-start text-slate-500">
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
                      <div className="flex flex-col max-w-4xl  gap-10 sm:justify-start">
                        <div className="flex items-center text-sm text-slate-400 sm:flex-row">
                          <span className="mr-3 w-1.5 h-1.5 bg-orange-500 rounded-full hidden sm:flex"></span>
                          <time>Posted:</time>
                          <time>{dayjs(createdAt).fromNow()}</time>
                        </div>
                        {description && description.trim() !== "" && (
                          <div className="">
                            <h4 className="font-medium text-slate-700 text-base mb-2">
                              Description:
                            </h4>
                            <p className="text-base text-slate-600 ">
                              {description}
                            </p>
                          </div>
                        )}

                        {requirements.length > 0 ? (
                          <div className="flex flex-col text-base gap-2">
                            <h4 className="font-medium text-slate-700 ">
                              Requirements
                            </h4>
                            <ul className=" text-slate-600 list-disc pl-4 space-y-1">
                              {requirements.map((requirement, index) => (
                                <li key={index}>{requirement}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                        {isActive && closing ? (
                          <div className="flex  items-center text-sm text-slate-400 sm:flex-row">
                            <span className="mr-3 w-1.5 h-1.5 bg-blue-500 rounded-full hidden sm:flex"></span>
                            <p>Deadline:</p>
                            <p>{closing}</p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex justify-center items-center mt-3 ">
                      {isActive ? (
                        <button
                          data-tally-open={formId}
                          data-tally-layout="modal"
                          data-tally-width="700"
                          data-tally-emoji-text="👋"
                          data-tally-emoji-animation="wave"
                          className="rounded-xl px-2 py-2 w-full  md:w-28 text-sm bg-orange-600 text-slate-50 hover:bg-orange-500 duration-200 font-semibold"
                        >
                          Apply Now
                        </button>
                      ) : (
                        <button
                          title="Application closed."
                          disabled
                          className="rounded-xl px-2 py-2 w-full md:w-28 bg-slate-400 cursor-not-allowed text-white duration-200 font-medium"
                        >
                          Closed
                        </button>
                      )}
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="text-gray-500 text-center py-10">
                No jobs available at the moment.
              </div>
            )}
          </section>
        </div>
      </section>
      {/* Recruitment Services */}
      <section className="relative py-20 bg-[url('/interview-panel.jpg')] bg-cover bg-center bg-no-repeat text-white">
        <div className="absolute inset-0 bg-black/70 bg-opacity-70 z-0"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <h2 className="font-serif text-orange-500 text-2xl md:text-4xl font-bold mb-6">
            Recruitment Services
          </h2>
          <p className="text-xl text-blue-100 mb-6">
            Looking to build your own exceptional team? We also provide
            recruitment and hiring services to help organizations find the right
            talent.
          </p>
          <p className="text-blue-100 mb-8">
            Our recruitment experts understand what makes great teams and can
            help you identify, attract, and hire top talent that aligns with
            your organization&apos;s mission and values.
          </p>
          <ContactButton />
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl font-bold text-orange-600 mb-6">
            Don&apos;t See the Right Role?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            We&apos;re always looking for talented individuals who share our
            passion for creating positive impact. Send us your resume and let us
            know how you&apos;d like to contribute to our mission.
          </p>
          <a
            href="mailto:hello@shamzbridgeconsult.org?subject=Contacting%20you%20about%20hiring%20service%20with%20Shamzbridge&body=Hi, %0D%0A%0D%0A"
            target="_blank"
            rel="noreferrer noopener"
            className="bg-orange-500 hover:bg-orange-700 text-white px-8 py-2 rounded-md font-medium text-lg transition-colors duration-200"
          >
            Send us your resume
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
