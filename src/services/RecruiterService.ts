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

 

// Master Prefill Services
export const masterPrefillCategoryService = async (id:any) => {
  try {
    const response = await axiosInstance.get(`/api/master-category?id=${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const masterPrefillJobTitleService = async (id:any) => {
  try {
    const response = await axiosInstance.get(`/api/master-job-title?id=${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const masterPrefillCityService = async (id:any) => {
  try {
    const response = await axiosInstance.get(`/api/master-city?id=${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const masterPrefillLocalityService = async (id:any) => {
  try {
    const response = await axiosInstance.get(`/api/master-locality?id=${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
// masterPrefillCityService masterPrefillLocalityService masterPrefillCategoryService

export const masterPrefillBenifitsService = async (id:any) => {
  try {
    const response = await axiosInstance.get(`/api/recruiter-job-benifit?jobId=${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const masterPrefillJobSkillsService = async (id:any) => {
  try {
    const response = await axiosInstance.get(`/api/recruiter-skills?jobId=${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const masterPrefillDocumentsService = async (id:any) => {
  try {
    const response = await axiosInstance.get(`/api/recruiter-document-upload?jobId=${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const masterPrefillAssetsRequiredService = async (id:any) => {
  try {
    const response = await axiosInstance.get(`/api/recruiter-assets-required?jobId=${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

