import Swal from "sweetalert2";
 
export const showAlert = (
  type: "success" | "error" | "warning" | "info",
  message: string,
  title?: string
) => {
  return Swal.fire({
    icon: type,
    title: title || capitalize(type),
    text: message,
    confirmButtonColor: "#3085d6",
  });
};

 
export const showConfirmAlert = async ({
  title = "Are you sure?",
  text = "You won't be able to revert this!",
  confirmText = "Yes, confirm!",
  cancelText = "Cancel",
  icon = "warning",
}: {
  title?: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: "warning" | "question" | "info";
}) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });

  return result.isConfirmed;   
};

 
const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);
