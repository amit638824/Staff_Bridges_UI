import axiosInstance from "@/services/index";

type FetchConfig = {
    signal?: AbortSignal;
};

const createMasterService = (endpoint: string) => {
    return async (name: string = "", config?: FetchConfig) => {
        let url = `?page=1&limit=30`;
        if (name) url += `&name=${name}`;

        const res = await axiosInstance.get(endpoint + url, {
            signal: config?.signal,
        });
 
        return res.data;
    };
};

export const masterCategoryService = createMasterService("/api/master-category");

export const masterJobTitleService = createMasterService("/api/master-job-title");

export const masterCityService = createMasterService("/api/master-city");

export const masterLocalityService = createMasterService("/api/master-locality");

export const masterBenifitsService = createMasterService("/api/master-job-benifits");

export const masterJobSKillsService = createMasterService("/api/master-skills");

export const masterDocumentsService = createMasterService("/api/master-recruiter-document");
export const masterAssetsRequiredService = createMasterService("/api/master-assets-required");

