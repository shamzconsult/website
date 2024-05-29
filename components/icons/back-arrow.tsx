import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const BackIcon = () => {
  return (
    <Link
      href={"/events"}
      className='flex gap-1 items-center text-gray-600 w-fit rounded-full border px-2 pr-3 py-0.5  text-sm font-normal hover:border-orange-400 duration-150'
    >
      <ArrowLeftIcon />

      <p>View all events</p>
    </Link>
  );
};

export default BackIcon;
