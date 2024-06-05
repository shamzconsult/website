import AddNewEventForm from "./addNew-eventForm";

const NewEvents = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-2 text-gray-600 p-8">
      <h1 className="text-2xl font-medium">Add new event</h1>
      <AddNewEventForm />
    </div>
  );
};
export default NewEvents;
