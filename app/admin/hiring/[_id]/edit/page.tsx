"use client";

import EditCareer from "@/components/admin/edit-career";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const getJobById = async (_id: string) => {
    try {
        const res = await fetch(`/api/career/${_id}`, {
            cache: "no-store",
        });
        if (!res.ok) {
            throw new Error("Error fetching job");
        }
        return res.json();
    } catch (error) {
        console.error("Error loading data", error);
        return null;
    }
};

function EditJob() {
    const { _id } = useParams();
    const [jobs, setJobs] = useState<any>(null);

    useEffect(() => {
        const fetchJobs = async () => {
            const jobData = await getJobById(_id as string);
            if (jobData) {
                setJobs(jobData?.job);
            }
        };
        fetchJobs();
    }, [_id]);

    if (!jobs) {
        return <div>Loading...</div>;
    }

    const { title, mode, type, location, isActive } = jobs;

    return (
        <div>
            <h1 className="font-bold text-2xl text-center mt-32">Edit Job</h1>
            <EditCareer
                _id={_id}
                title={title}
                mode={mode}
                type={type}
                location={location}
                isActive={isActive}
            />
        </div>
    );
}

export default EditJob;
