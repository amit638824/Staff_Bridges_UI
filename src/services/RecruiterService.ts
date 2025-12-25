import axiosInstance from "@/services/index";
 

export const JobPostService = async (data: any) => {
  const res = await axiosInstance.post("/api/recruiter-jobpost-create", data);
  return res.data;  
};

export const getRecruiterJobList = async (page = 1, limit = 10) => {
  const res = await axiosInstance.get("/api/recruiter-jobpost-list", {
    params: { page, limit },
  });
  return res.data;
};

export const deleteJobPstedServices = async (id:any) => {
  const res = await axiosInstance.delete(`/api/recruiter-jobpost-delete/${id}`);
  return res.data;
};

