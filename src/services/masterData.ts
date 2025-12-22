import axiosInstance from "@/services/index";

export const masterCategoryService = async (name: string) => {
    let url = `?page=1&limit=30`;
    if (name) url += `&name=${name}`;
    const res = await axiosInstance.get(`/api/master-category${url}`);
    return res.data;
};

export const masterJobTitleService = async (name: any) => {
    let url = `?page=1&limit=30`;
    if (name) url += `&name=${name}`;
    const res = await axiosInstance.get(`/api/master-job-title${url}`);
    return res.data;
};

export const masterCityService = async (name: any) => {
    let url = `?page=1&limit=30`;
    if (name) url += `&name=${name}`;
    const res = await axiosInstance.get(`/api/master-city${url}`);
    return res.data;
};

export const masterLocalityService = async (name: any) => {
    let url = `?page=1&limit=30`;
    if (name) url += `&name=${name}`;
    const res = await axiosInstance.get(`/api/master-locality${url}`);
    return res.data;
};

export const masterBenifitsService = async (name: any) => {
    let url = `?page=1&limit=30`;
    if (name) url += `&name=${name}`;
    const res = await axiosInstance.get(`/api/master-job-benifits${url}`);
    return res.data;
};

export const masterJobSKillsService = async (name: any) => {
    let url = `?page=1&limit=30`;
    if (name) url += `&name=${name}`;
    const res = await axiosInstance.get(`/api/master-skills${url}`);
    return res.data;
};

export const masterDocumentsService = async (name: any) => {
    let url = `?page=1&limit=30`;
    if (name) url += `&name=${name}`;
    const res = await axiosInstance.get(`/api/master-recruiter-document${url}`);
    return res.data;
};
