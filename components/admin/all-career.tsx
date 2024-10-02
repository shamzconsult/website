import { getAllJob } from "@/app/services/careerService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Footer from "../ui/footer";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AiOutlineEdit } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";

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

const deleteData = async (_id: number) => {
  try {
    const res = await fetch(`/api/career/${_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Unable to delete");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error deleting ", error);
  }
};

const toggleJobStatus = async (jobId: number, currentIsActive: boolean) => {
  try {
    const res = await fetch(`/api/career/${jobId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isActive: !currentIsActive }),
    });
    
    if (!res.ok) {
      throw new Error('Toggle failed')
    }
    const updatedJob = await res.json();
    return updatedJob;
  } catch (error) {
    console.error("Error toggling job status: ", error);
  }
}

const AllCareer = () => {
  const [jobs, setJobs] = useState<JobType[]>([]);

  const router = useRouter();

  const handleToggleChange = async (jobId: number, currentIsActive: boolean) => {
    try {
      const updatedJob = await toggleJobStatus(jobId, currentIsActive);

      if (updatedJob) {
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job._id === jobId ? { ...job, isActive: updatedJob.job.isActive } : job
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle job status:", error);
    }
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      router.push("/careers");
    }
  }, [router]);

  const fetchJobs = async () => {
    try {
      const data = await getAllJob();
      setJobs(data.jobs);
    } catch (error) {
      console.log("Error loading data", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (_id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this operation",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const deleteResult = await deleteData(_id);
          if (deleteResult) {
            setJobs((prevJobs) =>
              prevJobs.map((job) =>
                job._id === _id ? { ...job, isActive: false } : job
              )
            );
            Swal.fire({
              title: "Deleted!",
              text: "Career has been disabled",
              icon: "success",
            });
            fetchJobs();
          }
        } catch (error) {
          console.error("Error deleting", error);
        }
      }
    });
  };

  const totalJobs = jobs?.length || 0;

  return (
    <>
      <section className='min-h-screen max-w-screen-lg w-full mx-auto px-4 sm:px-6 mb-8'>
        <h1 className='font-bold mb-6 text-xl px-2 text-slate-800'>
          Careers ({totalJobs})
        </h1>
        <section className='flex flex-col gap-6 w-full'>
          {jobs?.length > 0 ? (
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
                  className='bg-slate-100 hover:bg-slate-100/80 p-4 md:p-8 rounded-xl shadow-lg 
                    flex flex-col md:flex-row justify-between items-center text-center min-[450px]:text-left '
                >
                  <div className='flex flex-col gap-4'>
                    <p className='font-semibold text-lg text-slate-700 font-sans'>
                      {title}
                    </p>
                    <ul
                      className='text-sm flex gap-6 list-disc px-4 justify-center 
                          min-[450px]:justify-start text-slate-500'
                    >
                      <li className='font-medium marker:text-orange-500'>
                        {type}
                      </li>
                      <li className='font-medium marker:text-blue-500'>
                        {mode}
                      </li>
                      {mode !== "Remote" && (
                        <li className='font-medium marker:text-orange-500 capitalize'>
                          {location}
                        </li>
                      )}
                    </ul>

                    <time className='text-sm text-slate-400 text-center md:text-left'>
                      {dayjs(createdAt).fromNow()}
                    </time>
                  </div>
                  <div className='flex md:flex-col items-center gap-3 justify-between'>
                    <div className='p-4 flex md:flex-row justify-between items-center gap-4'>
                      <Link
                        href={`/admin/hiring/${_id}/edit`}
                        className='hover:bg-slate-300/80 rounded-full p-1'
                      >
                        <AiOutlineEdit className='text-slate-600 text-2xl' />
                      </Link>
                      <div className='hover:bg-slate-300/80 rounded-full p-1'>
                        <MdDeleteOutline
                          onClick={() => handleDelete(_id)}
                          className='text-slate-600 text-2xl cursor-pointer'
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor={`toggle-activeness-${_id}`}
                        className='inline-flex relative items-center cursor-pointer'>
                        <input
                          type='checkbox'
                          id={`toggle-activeness-${_id}`}
                          className='sr-only peer'
                          checked={isActive}
                          onChange={() => handleToggleChange(_id, isActive)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                        <span className='bg-slate-700 rounded-full p-1 px-1.5 text-xs text-slate-200 ml-3 font-medium'>
                        {isActive ? "Active" : "Closed"}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            )
          ) : (
            <div className='text-gray-500'>No careers available</div>
          )}
        </section>
      </section>
      ``
      <Footer />
    </>
  );
};

export default AllCareer;
