import { useRouter } from "next/navigation";

const DeleteButton = ({ _id }: any) => {
  const router = useRouter();

  const deleteEvent = async () => {
    console.log(_id);
    const confirmed = confirm("Are you sure ?");
    if (confirmed) {
      const res = await fetch(`api/events/`, {
        method: "PATCH",
      });
      if (res.ok) {
        router.refresh();
      }
    }
  };

  return (
    <button
      onClick={deleteEvent}
      className="bg-red-500 text-white rounded-md w-fit px-5 font-medium border  hover:bg-red-600"
    >
      Delete
    </button>
  );
};

export default DeleteButton;
