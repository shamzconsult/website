import { getAllJob } from '@/app/services/careerService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Footer from '../ui/footer';
import dayjs from 'dayjs';
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

const deleteData = async (_id: number) => {
  try {
    const res = await fetch(`api/career/${_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error('Unable to delete');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error deleting ', error);
  }
};

const AllCareer = () => {
  const [jobs, setJobs] = useState<JobType[]>([]);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.push('careers');
    }
  }, [router]);

  const fetchJobs = async () => {
    try {
      const data = await getAllJob();
      console.log("Fetched careers data:", data)
      setJobs(data.jobs);
    } catch (error) {
      console.log('Error loading data', error);
    }
  };

  useEffect(() => {
    fetchJobs();
    console.log(jobs); 
  }, []);

  const handleDelete = async (_id: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this operation',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, disable it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const deleteResult = await deleteData(_id);
          if (deleteResult) {
            setJobs((prevJobs) =>
              prevJobs.filter((jobs) => jobs._id !== _id)
            );
            Swal.fire({
              title: 'Disabled!',
              text: 'Career has been disabled',
              icon: 'success',
            });
            fetchJobs(); // Refresh job list after deletion
          }
        } catch (error) {
          console.error('Error deleting', error);
        }
      }
    });
  };

  const totalJobs = jobs?.length || 0;

  return (
    <>
      <section className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 mb-8">
        <h1 className="font-bold mb-6 text-lg px-2 text-slate-800">
          Careers ({totalJobs})
        </h1>
        <section className="flex flex-col gap-4 w-full">
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
                  className="bg-slate-100 hover:bg-slate-100/80 p-[24px] rounded-[12px] min-[450px]:flex justify-between items-center text-center min-[450px]:text-left"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-col gap-2">
                      <p className="font-medium text-slate-700 font-sans">
                        {title}
                      </p>
                      <ul className="text-sm flex gap-8 list-disc px-4 justify-center min-[450px]:justify-start text-slate-500">
                        <li className="font-medium marker:text-orange-500">
                          {type}
                        </li>
                        <li className="font-medium marker:text-blue-500">
                          {mode}
                        </li>
                        {mode !== 'Remote' && (
                          <li className="font-medium marker:text-orange-500 capitalize">
                            {location}
                          </li>
                        )}
                      </ul>
                    </div>
                    <time className="text-sm text-slate-400">
                      {dayjs(createdAt).fromNow()}
                    </time>
                  </div>
                  
                    <div className="p-2 flex justify-between items-center">
                        <Link href={`/admin/hiring/${_id}/edit`}>
                          <button className="bg-green-400 rounded-md w-fit px-5 font-medium border text-white hover:bg-green-600">
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(_id)}
                          className="bg-blue-500 text-white rounded-md w-fit px-5 font-medium border  hover:bg-red-600"
                        >
                          {isActive ? "Disable" : "Deleted"}
                        </button>
                    </div>
                </div>
              )
            )
          ) : (
            <div className="text-gray-500">No careers available</div>
          )}
        </section>
      </section>
      <Footer />
    </>
  );
};

export default AllCareer;
