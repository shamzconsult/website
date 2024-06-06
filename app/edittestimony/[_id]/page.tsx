"use client";
import EditTestimonyForm from "@/components/edit-testimonyForm";
import Loading from "@/components/loader";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const getTestimonyById = async (_id: string) => {
  try {
    const res = await fetch(`/api/testimonies/${_id}`, {
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

export default function EditTestimony() {
  const { _id } = useParams();

  const [testimonies, setTestimony] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const testimonyData = await getTestimonyById(_id as string);
      setTestimony(testimonyData.testimony);
      setLoading(false);
    };

    fetchData();
  }, [_id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  if (!testimonies) {
    return (
      <div className="text-red-500 text-sm text-center p-4">
        Error loading event details, Please reload your browser
      </div>
    );
  }

  const { image, name, testimony, companyName, companyTitle } = testimonies;

  return (
    <div>
      <h1 className="font-bold text-2xl text-center mt-32">Edit Testimony..</h1>
      <EditTestimonyForm
        _id={_id}
        image={image}
        name={name}
        testimony={testimony}
        companyName={companyName}
        companyTitle={companyTitle}
      />
    </div>
  );
}
