"use client";
import React, { useState, useEffect } from "react";
import "aos/dist/aos.css";
import Link from "next/link";
import Loading from "./loader";
import Footer from "./ui/footer";
import { getAllTestimonies } from "./testimonials/testimony-slider";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface TestimonyType {
  image: string;
  name: string;
  testimony: string;
  companyName: string;
  companyTitle: string;
  isActive: boolean;
  _id: number;
}

const deleteData = async (_id: number) => {
  try {
    const res = await fetch(`/api/testimonies/${_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Error occurred while deleting");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error deleting ", error);
  }
};

const AllTestimonies = () => {
  const [testimonies, setTestimonies] = useState<TestimonyType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [router]);

  const fetchData = async () => {
    try {
      const data = await getAllTestimonies();
      setTestimonies(data.testimony);
      setLoading(false);
    } catch (error) {
      console.log("Error loading data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (_id: number) => {
    try {
      const result = await deleteData(_id);
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          setTestimonies((prevEvents: any) =>
            prevEvents.filter((event: any) => event._id !== _id)
          );
          Swal.fire({
            title: "Deleted!",
            text: "Testimony has been deleted.",
            icon: "success",
          });
        }
      });
    } catch (error) {
      console.error("Error deleting ", error);
    }
  };

  const TestimonyPageLoader = () => (
    <div className='min-h-[70vh] flex justify-center items-center'>
      <Loading />
    </div>
  );

  return (
    <>
      {loading ? (
        <TestimonyPageLoader />
      ) : (
        <div className='flex flex-col justify-center items-center mt-20 text-gray-600 p-8'>
          <section className='flex flex-col justify-center items-center gap-6'>
            <h1 className='font-medium text-2xl'>All Testimonies</h1>
            <div className='flex flex-wrap justify-start items-start gap-8'>
              {testimonies.length > 0 ? (
                testimonies.map(
                  ({
                    image,
                    name,
                    testimony,
                    companyName,
                    companyTitle,
                    isActive,
                    _id,
                  }) => (
                    <div className='p-10 flex flex-col gap-2 lg:w-[45%] border border-slate-100 rounded-md overflow-hidden hover:border-blue-400'>
                      <div key={_id} className='flex flex-col gap-4'>
                        <img
                          className='h-20 w-20 object-contain rounded-full object-top'
                          src={image}
                          alt='testimony'
                        />
                        <div className='flex flex-col gap-2 p-2'>
                          <h2 className='opacity-70 font-bold'>{testimony}</h2>
                          <p>{name}</p>
                          <div className='flex flex-col gap-2'>
                            <p className='bold text-lg'>{companyTitle}</p>
                            <p className='text-orange-500'>{companyName}</p>
                          </div>
                        </div>
                      </div>
                      <div className='p-2 flex justify-between items-center'>
                        <Link href={`/edittestimony/${_id}`}>
                          <button className='bg-green-400 rounded-md w-fit px-5 font-medium border text-white hover:bg-green-600'>
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(_id)}
                          className='bg-blue-500 text-white rounded-md w-fit px-5 font-medium border  hover:bg-red-600'
                        >
                          {isActive ? "Disable" : "Enable"}
                        </button>
                      </div>
                    </div>
                  )
                )
              ) : (
                <div>No testimony for now...</div>
              )}
            </div>
          </section>
        </div>
      )}
      <Footer />
    </>
  );
};

export default AllTestimonies;
