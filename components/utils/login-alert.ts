import Swal from "sweetalert2";

export const LoginAlert = () => {
  Swal.fire({
    position: "bottom-right",
    icon: "error",
    title: "wrong password",
    showConfirmButton: false,
    timer: 1200,
  });
};
