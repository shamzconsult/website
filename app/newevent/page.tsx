"use client";

import AllEvents from "@/components/all-events";
import Loading from "@/components/loader";
import NewEvents from "@/components/new-events";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AddNewEvent() {
  const router = useRouter();
  const [authenticated, setAuthenticate] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setAuthenticate(isLoggedIn);
    if (!isLoggedIn) {
      router.push("/signin");
    }
  }, [router]);

  const PageLoader = () => (
    <div className='min-h-[70vh] flex justify-center items-center'>
      <Loading />
    </div>
  );

  if (!authenticated) return <PageLoader />;
  return (
    <div className='mt-32 w-[90%] lg:w-[60%] mx-auto p-8'>
      <Link href={"/testimonies"}>
        <button className='flex justify-end items-end border border-orange-300 rounded-md px-3 hover:border-orange-600'>
          Manage testimonies
        </button>
      </Link>
      <NewEvents />
      <AllEvents />
    </div>
  );
}
