"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./loader";
import Footer from "./ui/footer";
import Link from "next/link";

interface JobType {
  title: string;
  description: string;
  eligibility: string;
  mode: string;
  location: string;
  about: string;
  payment: string;
  type: string;
  _id: number;
  isActive: boolean;
}

export const getJobById = async (_id: string) => {
  try {
    const res = await fetch(`/api/hiring/${_id}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Error found while fetching");
    }
    return res.json();
  } catch (error) {
    console.error("Error loading data", error);
    return null;
  }
};

const JobPostPreview = () => {
  const [job, setJob] = useState<JobType | null>(null);
  const { id } = useParams();

  const fetchData = async () => {
    try {
      const data = await getJobById(id as string);
      if (data) {
        setJob(data.job);
      }
    } catch (error) {
      console.error("Error loading data", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  // Corrected this line to check if job is still loading
  const loading = !job;

  const JobPageLoader = () => (
    <div className="min-h-screen flex justify-center items-center">
      <Loading />
    </div>
  );

  const jobDetails = job
    ? job
    : {
        title: "",
        description: "",
        eligibility: "",
        payment: "",
        about: "",
        mode: "",
        type: "",
        isActive: false,
        location: "",
      };
  const { title, description, eligibility, payment, about, mode, type, isActive, location } = jobDetails;

  return (
    <div className="">
      {loading ? (
        <JobPageLoader />
      ) : (
        <section className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 text-gray-600">
          <div className="bg-slate-100 p-6 rounded-2xl">
            <h1 className="font-bold mb-6 text-lg">Role</h1>
            <section className="flex flex-col gap-10">
              <div className="flex justify-between items-center bg-slate-100 p-5">
                <div>
                  <h2 className="text-lg font-semibold">{title}</h2>
                  <ul className="text-sm flex gap-8 text-gray-400 list-disc px-4">
                    <li className="marker:text-orange-500">{type}</li>
                    <li className="marker:text-blue-500">{mode}</li>
                    <li className="marker:text-orange-500">{location}</li>
                  </ul>
                </div>
                <div>
                  {isActive ? (
                    <Link href="https://tally.so/r/3yvrA4" target="_blank" rel="noopener noreferrer">
                      <button className="rounded-full bg-orange-600 hover:bg-orange-700 text-white duration-200 font-medium btn">
                        Apply
                      </button>
                    </Link>
                  ) : (
                    <button className="rounded-full bg-slate-600 text-white duration-200 font-medium btn">
                      Closed
                    </button>
                  )}
                </div>
              </div>

              <div tabIndex={0} className="collapse collapse-arrow border-base-300 bg-white border">
                <div className="collapse-title text-xl font-medium">Job Description</div>
                <div className="collapse-content">
                  <p>{description}</p>
                </div>
              </div>

              <div tabIndex={0} className="collapse collapse-arrow border-base-300 bg-white border">
                <div className="collapse-title text-xl font-medium">Job Criteria/Requirement</div>
                <div className="collapse-content">
                  <p>{eligibility}</p>
                </div>
              </div>

              <div tabIndex={0} className="collapse collapse-arrow border-base-300 bg-white border">
                <div className="collapse-title text-xl font-medium">Payment Range</div>
                <div className="collapse-content">
                  <p>{payment}</p>
                </div>
              </div>
            </section>
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
};

export default JobPostPreview;
