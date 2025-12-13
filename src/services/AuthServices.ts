import axiosInstance from "@/services/index";
 

export const loginService = async (data: any) => {
  const res = await axiosInstance.post("/auth/email-login", data);
  return res.data;  
};


// 🔹 Forgot Password Service
export const forgotPasswordService = async (email: string ) => {
 let url=`/auth/forget-password?`;
 

  const res = await axiosInstance.post("/auth/forget-password", { email });
  return res.data;
};

// 🔹 Reset Password
export const resetPasswordService = async (data: any) => {
  const res = await axiosInstance.post("/auth/reset-password", data);
  return res.data;
};

 export const socialLoginService = async (idToken: string) => {
  const res = await axiosInstance.post("/auth/social-login", { idToken });
  return res.data;
};


