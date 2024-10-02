"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/loader";
import AddNewJobForm from "@/components/admin/addNewJob";
import Footer from "@/components/ui/footer";
import AllCareer from "@/components/admin/all-career";

export default function AddNewJob() {
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
    <div className="mt-32 flex flex-col gap-16 justify-center items-center mx-auto w-[90%] p-10">
      <AddNewJobForm />
      <AllCareer/>
    </div>
  );
}
