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

export const deleteJobPstedServices = async (id: any) => {
  const res = await axiosInstance.delete(`/api/recruiter-jobpost-delete/${id}`);
  return res.data;
};

export const recruiterDocumentServices = async (id: any) => {
  const res = await axiosInstance.delete(`/api/recruiter-document-upload?limit=30&jobId=${id}`);
  return res.data;
};
export const recruiterAssestServices = async (id: any) => {
  const res = await axiosInstance.delete(`/api/recruiter-assets-required?limit=30&jobId=${id}`);
  return res.data;
};
export const recruiterSkillsServices = async (id: any) => {
  const res = await axiosInstance.delete(`/api/recruiter-skills?limit=30&jobId=${id}`);
  return res.data;
};

export const recruiterJobBenefitsServices = async (id: any) => {
  const res = await axiosInstance.delete(`/api/recruiter-job-benifit?limit=30&jobId=${id}`);
  return res.data;
};

