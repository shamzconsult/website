"use client";
import React, { useState, useEffect } from "react";
import "aos/dist/aos.css";
import Link from "next/link";
import Loading from "./loader";
import Footer from "./ui/footer";
import DeleteButton from "./delete-Btn";
import { getAllTestimonies } from "./testimonials/testimony-slider";

interface TestimonyType {
  image: string;
  name: string;
  testimony: string;
  companyName: string;
  companyTitle: string;
  _id: number;
}

const AllTestimonies = () => {
  const [testimonies, setTestimonies] = useState<TestimonyType[]>([]);
  const [loading, setLoading] = useState(true);

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

  const TestimonyPageLoader = () => (
    <div className="min-h-[70vh] flex justify-center items-center">
      <Loading />
    </div>
  );

  return (
    <>
      {loading ? (
        <TestimonyPageLoader />
      ) : (
        <div className="flex flex-col justify-center items-center mt-20 text-gray-600 p-8">
          <section className="flex flex-col justify-center items-center gap-6">
            <h1 className="font-bold text-lg">All Testimonies</h1>
            <div className="flex flex-wrap justify-center items-start gap-8">
              {testimonies.length > 0 ? (
                testimonies.map(
                  ({
                    image,
                    name,
                    testimony,
                    companyName,
                    companyTitle,
                    _id,
                  }) => (
                    <div className="flex flex-col gap-2 lg:w-[45%] border border-slate-100 rounded-md overflow-hidden hover:border-blue-400">
                      <div key={_id}>
                        <img
                          className="h-20 w-20 object-contain rounded-full object-top"
                          src={image}
                          alt="testimony"
                        />
                        <div className="flex flex-col gap-2 p-2">
                          <h2 className="opacity-70 font-bold">{testimony}</h2>
                          <p>{name}</p>
                          <div className="flex flex-col gap-2">
                            <p className="bold text-lg">{companyTitle}</p>
                            <p className="text-orange-500">{companyName}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2 flex justify-between items-center">
                        <Link href={`/edittestimony/${_id}`}>
                          <button className="bg-green-100 rounded-md w-fit px-5 font-medium border hover:border-orange-300 hover:bg-white">
                            Edit
                          </button>
                        </Link>
                        <DeleteButton _id={_id} />
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
