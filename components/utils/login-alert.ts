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
    title: "Event added successfully",
    showConfirmButton: false,
    timer: 1200,
  });
};
