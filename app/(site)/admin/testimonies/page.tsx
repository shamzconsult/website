"use client";

import AddNewTestimonyForm from "@/components/admin/addNew-testimonyForm";
import AllTestimonies from "@/components/admin/all-testimonies";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/loader";

export default function AddNewTestimony() {
  const router = useRouter();
  const [authenticated, setAuthenticate] = useState(false);
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setAuthenticate(isLoggedIn);
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [router]);

  const PageLoader = () => (
    <div className="min-h-[70vh] flex justify-center items-center">
      <Loading />
    </div>
  );

  if (!authenticated) return <PageLoader />;
  return (
    <div className="mt-32 mx-auto w-[90%] p-10">
      <AddNewTestimonyForm />
      <AllTestimonies />
    </div>
  );
}
