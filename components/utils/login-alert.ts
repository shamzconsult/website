import Swal from "sweetalert2";

export const LoginAlert = () => {
  Swal.fire({
    position: "center",
    icon: "error",
    title: "wrong password",
    showConfirmButton: false,
    timer: 1200,
  });
};

export const EventAlert = () => {
  Swal.fire({
    position: "center",
    icon: "success",
    title: "Details added successfully",
    showConfirmButton: false,
    timer: 1200,
  });
};

export const UpdatedAlert = () => {
  Swal.fire({
    position: "center",
    icon: "success",
    title: "Details updated successfully",
    showConfirmButton: false,
    timer: 1200,
  });
};

export const NewsLetterAlert = () => {
  Swal.fire({
    position: "center",
    icon: "success",
    title: "You've subscribed to our newsLetter successfully..",
    showConfirmButton: false,
    timer: 5000,
  });
};
