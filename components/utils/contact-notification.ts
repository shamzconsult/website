import Swal from "sweetalert2";

export const contactNotification = () => {
  Swal.fire({
    position: "center",
    icon: "success",
    title: "Message sent successfully",
    showConfirmButton: false,
    timer: 1500,
  });
};
