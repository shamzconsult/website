import { useRouter } from "next/navigation";
import { useState } from "react";
import { UpdatedAlert } from "../utils/login-alert";
import { NigeriaStates } from "@/app/services/nigeriaStates";


export default function EditCareer({
    _id,
    formId,
    title,
    mode,
    location,
    type,
    createdAt,
    isActive
}: any) {
    const [newTitle, setNewTitle] = useState(title);
    const [newMode, setNewMode] = useState(mode);
    const [newLocation, setNewLocation] = useState(location);
    const [newType, setNewType] = useState(type);
    const [newIsActive, setNewIsActive] = useState(isActive);
    const router = useRouter();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const res = await fetch(`/api/career/${_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    newTitle,
                    newMode,
                    location: mode === "Remote" ? "" : location,
                    newType,
                    newIsActive,
                }),
            })
            if(res.ok) {
                UpdatedAlert();
                router.push("/career");
            } else {
                throw new Error ("Failed to update Job");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}
                className='w-full flex flex-col justify-center gap-6 bg-slate-50 rounded-md p-10 lg:w-[70%]'
                >
                <div className='flex flex-col gap-1 text-sm font-medium capitalize'>
                    <label>Job title</label>
                    <input 
                        onChange={(e) => setNewTitle(e.target.value)}
                        type="text"
                        value={newTitle}
                        placeholder="Job title"
                        className="rounded-md border bg-white border-slate-200 w-full p-2 outline-none placeholder:opacity-50" 
                        required
                    />
                </div>

                <div className='flex flex-col gap-1 text-sm font-medium capitalize'>
                    <label>Type</label>
                    <select
                        onChange={(e) => setNewType(e.target.value)}
                        value={newType}
                        className='rounded-md text-sm border bg-white border-slate-200 w-full p-2 outline-none placeholder:opacity-50'
                        required
                    >
                        <option value='' disabled>
                            Select
                        </option>
                        <option value='Fulltime'>Fulltime</option>
                        <option value='Part-time'>Part-time</option>
                        <option value='Contract'>Contract</option>
                    </select>
                </div>

                <div className='flex flex-col gap-1 text-sm font-medium capitalize'>
                    <label>Mode</label>
                    <select
                        onChange={(e) => setNewMode(e.target.value)}
                        value={newMode}
                        className='rounded-md text-sm border border-slate-200 w-full p-2 outline-none placeholder:opacity-50'
                        required
                    >
                        <option value='' disabled>
                            Select
                        </option>
                        <option value='Physical'>Physical</option>
                        <option value='Hybrid'>Hybrid</option>
                        <option value='Remote'>Remote</option>
                    </select>
                </div>

                {mode !== "Remote" && (
                    <div className='flex flex-col gap-1 text-sm font-medium capitalize'>
                        <label>Location</label>
                        <select
                            onChange={(e) => setNewLocation(e.target.value)}
                            value={newLocation}
                            className='rounded-md text-sm border border-slate-200 w-full p-2 outline-none placeholder:opacity-50'
                        >
                            <option value='' disabled>
                            Select
                            </option>
                            {NigeriaStates.map((state) => (
                            <option key={state} value={state.toLowerCase()}>
                                {state}
                            </option>
                            ))}
                        </select>
                    </div>
                )}

                    <button
                        type='submit'
                        className='rounded-md bg-orange-500 px-8 py-2 w-fit font-semibold text-white hover:bg-orange-700 duration-200 '
                    >
                        Update Job
                    </button>

            </form>
        </div>
    )
}