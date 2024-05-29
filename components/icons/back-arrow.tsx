import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const BackIcon = () => {
  return (
    <Link
      href={"/events"}
      className="flex gap-1 items-center text-gray-600 border border-slate-300 w-fit px-2 rounded-xl text-sm font-normal hover:border-orange-400 duration-150 my-8"
    >
      <ArrowLeftIcon />

      <p>Back</p>
    </Link>
  );
};

export default BackIcon;
