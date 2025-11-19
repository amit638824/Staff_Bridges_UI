// utils/alert.ts
import Swal from "sweetalert2";

export const showAlert = (
  type: "success" | "error" | "warning" | "info",
  message: string,
  title?: string
) => {
  return Swal.fire({
    icon: type,
    title: title || (type === "success" ? "Success" : "Alert"),
    text: message,
  });
};
