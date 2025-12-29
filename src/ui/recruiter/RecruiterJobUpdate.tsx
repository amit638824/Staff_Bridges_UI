'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { GoPlus } from "react-icons/go";
import { IoCheckmark } from "react-icons/io5";
import { useForm, Controller, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Loader from "@/ui/common/loader/Loader"
import {
  masterCategoryService,
  masterJobTitleService,
  masterCityService,
  masterLocalityService,
  masterBenifitsService,
  masterJobSKillsService,
  masterDocumentsService,
  masterAssetsRequiredService
} from "@/services/masterData";
import {
  JobPostService,
  masterPrefillCategoryService,
  masterPrefillCityService,
  masterPrefillJobTitleService,
  masterPrefillLocalityService,
  masterPrefillAssetsRequiredService,
  masterPrefillDocumentsService,
  masterPrefillJobSkillsService,
  masterPrefillBenifitsService
} from "@/services/RecruiterService";
import ServerSearchSelect from '@/components/Common/SearchableSelect';
import MultiSelectWithServerSearch from '@/components/Common/MultiSelectWithServerSearch';
import RichTextEditor from '@/components/Common/RichTextEditors';
import { showAlert } from "@/utils/swalFire";
import { generateJobDescription } from "@/services/jobDescriptionTemplate";
import { useRouter } from "next/navigation";
import { useUser } from '@/hooks/useSession';

interface SelectOption {
  value: number;
  label: string;
  original?: any;
}

interface FormValues {
  // Basic Information
  jobTitle: SelectOption | null;
  category: SelectOption | null;
  openings: string;
  jobType: string;
  isContractJob: boolean;
  workLocation: string;

  // Location & Demographics
  city: SelectOption | null;
  locality: SelectOption | null;
  gender: string;
  qualification: string;

  // Experience & Salary
  minExperience: string;
  maxExperience: string;
  onlyFresher: boolean;
  salaryBenefits: string;
  salaryMin: string;
  salaryMax: string;

  // Job Details
  benefits: SelectOption[];
  skills: SelectOption[];
  documents: SelectOption[];
  workingDays: string;
  shift: string;
  minJobTiming: string;
  maxJobTiming: string;

  // Interview & Communication
  interviewAddress: string;
  candidateCanCall: boolean;
  communicationWindow: string[];

  // Assets & Deposit
  depositRequired: string;
  assetsRequired: SelectOption[];

  // Description
  description: string;
}

const RecruiterJob = () => {
  const user = useUser();
  const [jobData, setJobData] = useState<any>(null);
  const [title, setTitle] = useState<SelectOption | null>(null);
  const [city, setCity] = useState<SelectOption | null>(null);
  const [locality, setLocality] = useState<SelectOption | null>(null);
  const [category, setCategory] = useState<SelectOption | null>(null);
  const [documents, setDocuments] = useState<SelectOption[]>([]);
  const [assets, setAssets] = useState<SelectOption[]>([]);
  const [skills, setSkills] = useState<SelectOption[]>([]);
  const [benefits, setBenefits] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestedTemplate, setSuggestedTemplate] = useState<string>("");
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [hasPrefilled, setHasPrefilled] = useState(false);

  // Load job data from localStorage on component mount
  useEffect(() => {
    const data: any = localStorage.getItem('jobUpdate');
    if (data) {
      const jobUpdate = JSON.parse(data);
      setJobData(jobUpdate); 
    }
  }, []);

  // Map prefill data for single select fields
  const mapPrefillData = (res: any, labelKey: string = 'name') => {
    if (!res?.data?.items?.length) return null; 
    const item = res.data.items[0];
    return {
      label: item[labelKey],
      value: item.id,
      original: item,
    };
  };

  // Map prefill data for multi-select fields
  const mapMultiSelectPrefill = (res: any, labelKey: string) => {
    if (!res?.data?.items?.length) return []; 
    return res.data.items.map((item: any) => ({
      label: item[labelKey],
      value: item.id,
      original: {
        id: item.id,
        name: item[labelKey],
      },
    }));
  }; 

  useEffect(() => {
    if (!jobData?.job_id || hasPrefilled) return;

    const fetchAllPrefillData = async () => {
      try { 
        const [
          titleRes,
          cityRes,
          localityRes,
          categoryRes,
          documentsRes,
          assetsRes,
          skillsRes,
          benefitsRes,
        ] = await Promise.all([
          masterPrefillJobTitleService(jobData.job_title_id),
          masterPrefillCityService(jobData.city_id),
          masterPrefillLocalityService(jobData.locality_id),
          masterPrefillCategoryService(jobData.category_id),
          masterPrefillDocumentsService(jobData.job_id),
          masterPrefillAssetsRequiredService(jobData.job_id),
          masterPrefillJobSkillsService(jobData.job_id),
          masterPrefillBenifitsService(jobData.job_id),
        ]); 
        setTitle(mapPrefillData(titleRes));
        setCity(mapPrefillData(cityRes));
        setLocality(mapPrefillData(localityRes));
        setCategory(mapPrefillData(categoryRes)); 
        // Set multi-select fields
        setDocuments(mapMultiSelectPrefill(documentsRes, "documentname"));
        setAssets(mapMultiSelectPrefill(assetsRes, "assetname"));
        setSkills(mapMultiSelectPrefill(skillsRes, "skillname"));
        setBenefits(mapMultiSelectPrefill(benefitsRes, "benifitname")); 

      } catch (error) {
        console.error("Error fetching prefill data:", error);
      }
    };

    fetchAllPrefillData();
  }, [jobData, hasPrefilled]); 
  const validationSchema = yup.object({ 
    jobTitle: yup
      .object({
        value: yup.number().required('Job Title is required'),
        label: yup.string().required()
      })
      .nullable()
      .required('Job Title is required'),

    category: yup
      .object({
        value: yup.number().required('Job Category is required'),
        label: yup.string().required()
      })
      .nullable()
      .required('Job Category is required'),

    openings: yup
      .string()
      .required('Number of Openings is required')
      .test('is-number', 'Must be a valid number', (value) => !isNaN(parseInt(value)))
      .test('min-value', 'Openings must be at least 1', (value) => {
        const num = parseInt(value);
        return !isNaN(num) && num >= 1;
      }),

    jobType: yup.string().required('Job type is required'),
    isContractJob: yup.boolean().default(false),
    workLocation: yup.string().required('Work location is required'), 
    city: yup
      .object({
        value: yup.number().required('City is required'),
        label: yup.string().required()
      })
      .nullable()
      .required('City is required'),

    locality: yup
      .object({
        value: yup.number().required('Locality is required'),
        label: yup.string().required()
      })
      .nullable()
      .required('Locality is required'),

    gender: yup.string().required('Gender is required'),
    qualification: yup.string().required('Qualification is required'),

    // Experience & Salary
    minExperience: yup
      .string()
      .test('experience-required', 'Minimum experience is required', function (value) {
        const onlyFresher = this.parent.onlyFresher;
        if (onlyFresher) return true;
        return !!(value && value.trim() !== '');
      })
      .test('is-number', 'Must be a valid number', function (value) {
        const onlyFresher = this.parent.onlyFresher;
        if (onlyFresher) return true;
        if (!value || value.trim() === '') return true;
        return !isNaN(parseFloat(value));
      }),

    maxExperience: yup
      .string()
      .test('experience-required', 'Maximum experience is required', function (value) {
        const onlyFresher = this.parent.onlyFresher;
        if (onlyFresher) return true;
        return !!(value && value.trim() !== '');
      })
      .test('is-number', 'Must be a valid number', function (value) {
        const onlyFresher = this.parent.onlyFresher;
        if (onlyFresher) return true;
        if (!value || value.trim() === '') return true;
        return !isNaN(parseFloat(value));
      })
      .test('experience-range', 'Minimum experience cannot be greater than maximum experience', function (value) {
        const { minExperience, onlyFresher } = this.parent;
        if (onlyFresher) return true;
        if (!minExperience || !value || minExperience.trim() === '' || value.trim() === '') return true;

        const minExp = parseFloat(minExperience);
        const maxExp = parseFloat(value);

        if (isNaN(minExp) || isNaN(maxExp)) return true;
        return minExp <= maxExp;
      }),

    onlyFresher: yup.boolean().default(false),

    salaryBenefits: yup.string().required('Salary benefits is required'),

    salaryMin: yup
      .string()
      .required('Minimum salary is required')
      .test('is-number', 'Must be a valid number', (value) => !isNaN(parseFloat(value)))
      .test('min-value', 'Salary must be positive', (value) => {
        const num = parseFloat(value);
        return !isNaN(num) && num >= 0;
      }),

    salaryMax: yup
      .string()
      .required('Maximum salary is required')
      .test('is-number', 'Must be a valid number', (value) => !isNaN(parseFloat(value)))
      .test('min-value', 'Salary must be positive', (value) => {
        const num = parseFloat(value);
        return !isNaN(num) && num >= 0;
      })
      .test('salary-range', 'Minimum salary cannot be greater than maximum salary', function (value) {
        const { salaryMin } = this.parent;
        if (!salaryMin || !value) return true;

        const minSalary = parseFloat(salaryMin);
        const maxSalary = parseFloat(value);

        if (isNaN(minSalary) || isNaN(maxSalary)) return true;
        return minSalary <= maxSalary;
      }),

    // Job Details
    benefits: yup.array().of(
      yup.object({
        value: yup.number().required(),
        label: yup.string().required()
      })
    ).default([]),

    skills: yup.array().of(
      yup.object({
        value: yup.number().required(),
        label: yup.string().required()
      })
    ).default([]),

    documents: yup.array().of(
      yup.object({
        value: yup.number().required(),
        label: yup.string().required()
      })
    ).default([]),

    workingDays: yup.string().required('Working days is required'),
    shift: yup.string().required('Shift is required'),

    minJobTiming: yup
      .string()
      .required('Start time is required')
      .test('is-number', 'Must be a valid number', (value) => !isNaN(parseFloat(value)))
      .test('valid-time', 'Time must be between 0 and 24', (value) => {
        const time = parseFloat(value);
        return !isNaN(time) && time >= 0 && time <= 24;
      }),

    maxJobTiming: yup
      .string()
      .required('End time is required')
      .test('is-number', 'Must be a valid number', (value) => !isNaN(parseFloat(value)))
      .test('valid-time', 'Time must be between 0 and 24', (value) => {
        const time = parseFloat(value);
        return !isNaN(time) && time >= 0 && time <= 24;
      })
      .test('timing-range', 'Start time must be less than end time', function (value) {
        const { minJobTiming } = this.parent;
        if (!minJobTiming || !value) return true;

        const startTime = parseFloat(minJobTiming);
        const endTime = parseFloat(value);

        if (isNaN(startTime) || isNaN(endTime)) return true;
        return startTime < endTime;
      }),

    // Interview & Communication
    interviewAddress: yup
      .string()
      .required('Interview address is required')
      .min(10, 'Address must be at least 10 characters'),

    candidateCanCall: yup.boolean().default(false),
    communicationWindow: yup.array().of(yup.string()).default([]),

    // Assets & Deposit
    depositRequired: yup.string().required('Deposit information is required'),
    assetsRequired: yup.array().of(
      yup.object({
        value: yup.number().required(),
        label: yup.string().required()
      })
    ).default([]),

    // Description
    description: yup
      .string()
      .required('Job description is required')
      .test('not-empty', 'Job description is required', (value: any) => {
        return value && value.trim().length > 0;
      }),
  });

  // Initialize form with conditional defaults
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
    watch,
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: {
      jobTitle: null,
      category: null,
      openings: '',
      jobType: 'Full-time',
      isContractJob: false,
      workLocation: 'Office',
      city: null,
      locality: null,
      gender: 'Any',
      qualification: 'Any',
      minExperience: '',
      maxExperience: '',
      onlyFresher: false,
      salaryBenefits: 'Fixed',
      salaryMin: '',
      salaryMax: '',
      benefits: [],
      skills: [],
      documents: [],
      workingDays: '5',
      shift: 'Day',
      minJobTiming: '',
      maxJobTiming: '',
      interviewAddress: user?.user_locality || '',
      candidateCanCall: false,
      communicationWindow: [],
      depositRequired: 'No',
      assetsRequired: [],
      description: '',
    },
    mode: 'onBlur',
  });
  const prefillForm = useCallback(() => {
    if (jobData && title && city && locality && category && !hasPrefilled) { 
      setValue('jobTitle', title);
      setValue('category', category);
      setValue('openings', jobData.openings?.toString() || '');
      setValue('jobType', jobData.job_type || 'Full-time');
      setValue('isContractJob', jobData.isContractJob || false);
      setValue('workLocation', jobData.work_location || 'Office');
      setValue('city', city);
      setValue('locality', locality);
      setValue('gender', jobData.gender || 'Any');
      setValue('qualification', jobData.qualification || 'Any');
      setValue('minExperience', jobData.min_experience?.toString() || '');
      setValue('maxExperience', jobData.max_experience?.toString() || '');
      setValue('onlyFresher', jobData.only_fresher || false);
      setValue('salaryBenefits', jobData.salary_benefits || 'Fixed');
      setValue('salaryMin', jobData.salary_min?.toString() || '');
      setValue('salaryMax', jobData.salary_max?.toString() || '');
      setValue('benefits', benefits);
      setValue('skills', skills);
      setValue('documents', documents);
      setValue('workingDays', jobData.working_days?.toString() || '5');
      setValue('shift', jobData.shift || 'Day');
      setValue('minJobTiming', jobData.min_job_timing?.toString() || '');
      setValue('maxJobTiming', jobData.max_job_timing?.toString() || '');
      setValue('interviewAddress', jobData.interview_address || user?.user_locality || '');
      setValue('candidateCanCall', jobData.candidate_can_call || false);
      setValue('communicationWindow', jobData.communication_window || []);
      setValue('depositRequired', jobData.deposit_required || 'No');
      setValue('assetsRequired', assets);
      setValue('description', jobData.description || ''); 
      setHasPrefilled(true); 
    }
  }, [jobData, title, city, locality, category, benefits, skills, documents, assets, user, hasPrefilled, setValue]);
  // Call prefillForm when all data is ready
  useEffect(() => {
    prefillForm();
  }, [prefillForm]);

  // Watch certain fields for conditional logic
  const onlyFresher = useWatch({ control, name: 'onlyFresher' });
  const candidateCanCall = useWatch({ control, name: 'candidateCanCall' }); 
  // Handle fresher checkbox
  useEffect(() => {
    if (onlyFresher) {
      setValue('minExperience', '0');
      setValue('maxExperience', '0');
    }
  }, [onlyFresher, setValue]); 
  // Handle communication window checkbox
  useEffect(() => {
    if (candidateCanCall) {
      setValue('communicationWindow', ['10:00-19:00']);
    } else {
      setValue('communicationWindow', []);
    }
  }, [candidateCanCall, setValue]);

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setLoading(true);

    try {  
      const formatQualification = (qual: string): string => {
        const map: Record<string, string> = {
          'Any': 'Any',
          'highschool': 'highschool',
          'intermediate': 'intermediate',
          'diploma': 'diploma',
          'graduate': 'graduate',
          'postgraduate': 'postgraduate'
        };
        return map[qual] || 'Any';
      };

      // Format work location
      const formatWorkLocation = (location: string): string => {
        const map: Record<string, string> = {
          'Office': 'Office',
          'Field': 'Field',
          'WorkFromHome': 'WorkFromHome'
        };
        return map[location] || 'Office';
      };

      // Format working days
      const formatWorkingDays = (days: string): string => {
        const map: Record<string, string> = {
          '5': '5',
          '6': '6',
          'other': 'other'
        };
        return map[days] || '5';
      };

      // Prepare form data for submission
      const formData = {
        // Basic Information
        recruiterId: user?.user_id,
        titleId: data.jobTitle?.value,
        categoryId: data.category?.value,
        cityId: data.city?.value,
        localityId: data.locality?.value, 
        openings: parseInt(data.openings),
        jobType: data.jobType,
        workLocation: formatWorkLocation(data.workLocation), 
        gender: data.gender,
        qualification: formatQualification(data.qualification), 
        minExperience: data.onlyFresher ? 0 : parseFloat(data.minExperience || '0'),
        maxExperience: data.onlyFresher ? 0 : parseFloat(data.maxExperience || '0'),
        onlyFresher: data.onlyFresher ? 1 : 0, 
        salaryBenefits: data.salaryBenefits,
        salaryMin: parseFloat(data.salaryMin || '0'),
        salaryMax: parseFloat(data.salaryMax || '0'), 
        workingDays: formatWorkingDays(data.workingDays),
        shift: data.shift,
        minJobTiming: parseFloat(data.minJobTiming || '0'),
        maxJobTiming: parseFloat(data.maxJobTiming || '0'), 
        interviewAddress: data.interviewAddress,
        candidateCanCall: data.candidateCanCall ? 1 : 0,
        communicationWindow: data.communicationWindow, 
        depositRequired: data.depositRequired === 'Yes' ? 1 : 0, 
        description: data.description, 
        jobPostingFor: 'INDIVIDUAL',
        status: 'DRAFT', 
        jobSkillsIds: data.skills.map(skill => skill.value),
        assetsIds: data.assetsRequired.map(asset => asset.value),
        documentsIds: data.documents.map(doc => doc.value),
        jobBenefitsIds: data.benefits.map(benefit => benefit.value), 
      };

      console.log("Processed form data for API:", formData);
 
    } catch (error: any) {
      console.error('Error submitting form:', error);
      showAlert('error', error.message || 'An error occurred while posting the job');
    } finally {
      setLoading(false);
    }
  }; 
  return (
    <div className='jobposting'>
      {loading && <Loader />}
      <div className='container'>
        <div className='row'>
          <div className='col-md-12'>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className='formsection'>

                {/* Job Basic Information */}
                <div className='row'>
                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Job Title<span className='redastric'>*</span></label>
                      <Controller
                        name="jobTitle"
                        control={control}
                        render={({ field }) => (
                          <ServerSearchSelect
                            placeholder="Search job title"
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            fetchOptions={(input: any, config: any) =>
                              masterJobTitleService(input, config)
                            }
                          />
                        )}
                      />
                      {errors.jobTitle && <div className="text-danger small">{errors.jobTitle.message}</div>}
                    </div>
                  </div>

                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Job Category<span className='redastric'>*</span></label>
                      <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                          <ServerSearchSelect
                            placeholder="Search job Category"
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            fetchOptions={(input: any, config: any) =>
                              masterCategoryService(input, config)
                            }
                          />
                        )}
                      />
                      {errors.category && <div className="text-danger small">{errors.category.message}</div>}
                    </div>
                  </div>

                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Number of Openings<span className='redastric'>*</span></label>
                      <Controller
                        name="openings"
                        control={control}
                        render={({ field }) => (
                          <input
                            type="number"
                            className={`form-control ${errors.openings ? 'is-invalid' : ''}`}
                            placeholder="e.g. 1"
                            value={field.value}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Ensure non-negative
                              if (parseInt(value) < 1 && value !== '') return;
                              field.onChange(value);
                            }}
                            onBlur={field.onBlur}
                            min="1"
                          />
                        )}
                      />
                      {errors.openings && <div className="text-danger small">{errors.openings.message}</div>}
                    </div>
                  </div>
                </div>

                {/* Job Type & Location */}
                <div className='row'>
                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Job Type<span className='redastric'>*</span></label>
                      <div className="d-grid gap-2 d-md-flex roundbtn">
                        <Controller
                          name="jobType"
                          control={control}
                          render={({ field }) => (
                            <>
                              <button
                                className={`btn ${field.value === 'Full-time' ? 'btn-primary selected' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('Full-time')}
                              >
                                Full Time
                              </button>
                              <button
                                className={`btn ${field.value === 'Part-time' ? 'btn-primary selected' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('Part-time')}
                              >
                                Part Time
                              </button>
                              <button
                                className={`btn ${field.value === 'Contract' ? 'btn-primary selected' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('Contract')}
                              >
                                Contract
                              </button>
                            </>
                          )}
                        />
                      </div>
                      {errors.jobType && <div className="text-danger small">{errors.jobType.message}</div>}
                    </div>
                  </div>

                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Work Location Type<span className='redastric'>*</span></label>
                      <div className="d-grid gap-2 d-md-flex roundbtn">
                        <Controller
                          name="workLocation"
                          control={control}
                          render={({ field }) => (
                            <>
                              <button
                                className={`btn ${field.value === 'Office' ? 'btn-primary selected' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('Office')}
                              >
                                Work from office
                              </button>
                              <button
                                className={`btn ${field.value === 'Field' ? 'btn-primary selected' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('Field')}
                              >
                                Field job
                              </button>
                              <button
                                className={`btn ${field.value === 'WorkFromHome' ? 'btn-primary selected' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('WorkFromHome')}
                              >
                                Work from home
                              </button>
                            </>
                          )}
                        />
                      </div>
                      {errors.workLocation && <div className="text-danger small">{errors.workLocation.message}</div>}
                    </div>
                  </div>

                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Choose City<span className='redastric'>*</span></label>
                      <Controller
                        name="city"
                        control={control}
                        render={({ field }) => (
                          <ServerSearchSelect
                            placeholder="Search City"
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            fetchOptions={(input: any, config: any) =>
                              masterCityService(input, config)
                            }
                          />
                        )}
                      />
                      {errors.city && <div className="text-danger small">{errors.city.message}</div>}
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Job Locality<span className='redastric'>*</span></label>
                      <Controller
                        name="locality"
                        control={control}
                        render={({ field }) => (
                          <ServerSearchSelect
                            placeholder="Search Locality"
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            fetchOptions={(input: any, config: any) =>
                              masterLocalityService(input, config)
                            }
                          />
                        )}
                      />
                      {errors.locality && <div className="text-danger small">{errors.locality.message}</div>}
                    </div>
                  </div>

                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Gender<span className='redastric'>*</span></label>
                      <div className="d-grid gap-2 d-md-flex roundbtn">
                        <Controller
                          name="gender"
                          control={control}
                          render={({ field }) => (
                            <>
                              <button
                                className={`btn ${field.value === 'Any' ? 'btn-primary selected' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('Any')}
                              >
                                Any
                              </button>
                              <button
                                className={`btn ${field.value === 'Male' ? 'btn-primary selected' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('Male')}
                              >
                                Male
                              </button>
                              <button
                                className={`btn ${field.value === 'Female' ? 'btn-primary selected' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('Female')}
                              >
                                Female
                              </button>
                            </>
                          )}
                        />
                      </div>
                      {errors.gender && <div className="text-danger small">{errors.gender.message}</div>}
                    </div>
                  </div>

                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Minimum Qualification Required<span className='redastric'>*</span></label>
                      <div className="d-grid gap-2 d-md-flex roundbtn">
                        <Controller
                          name="qualification"
                          control={control}
                          render={({ field }) => (
                            <>
                              <button
                                className={`btn ${field.value === 'Any' ? 'btn-primary selected' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('Any')}
                              >
                                Any
                              </button>
                              <button
                                className={`btn ${field.value === 'highschool' ? 'btn-primary selected' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('highschool')}
                              >
                                10th Pass
                              </button>
                              <button
                                className={`btn ${field.value === 'intermediate' ? 'btn-primary selected' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('intermediate')}
                              >
                                12th Pass
                              </button>
                              <button
                                className={`btn ${field.value === 'diploma' ? 'btn-primary selected' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('diploma')}
                              >
                                Diploma
                              </button>
                              <button
                                className={`btn ${field.value === 'graduate' ? 'btn-primary selected' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('graduate')}
                              >
                                Graduate
                              </button>
                              <button
                                className={`btn ${field.value === 'postgraduate' ? 'btn-primary selected' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('postgraduate')}
                              >
                                Post Graduate
                              </button>
                            </>
                          )}
                        />
                      </div>
                      {errors.qualification && <div className="text-danger small">{errors.qualification.message}</div>}
                    </div>
                  </div>
                </div>

                {/* Experience & Salary */}
                <div className='row'>
                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Required Experience<span className='redastric'>*</span></label>
                      <div className="mutipleSelctBox">
                        <Controller
                          name="minExperience"
                          control={control}
                          render={({ field }) => (
                            <input
                              type="number"
                              className={`form-control ${errors.minExperience ? 'is-invalid' : ''}`}
                              placeholder="Min (years)"
                              value={field.value}
                              onChange={(e) => {
                                const value = e.target.value;
                                // Ensure non-negative
                                if (parseFloat(value) < 0 && value !== '') return;
                                field.onChange(value);
                              }}
                              onBlur={field.onBlur}
                              min="0"
                              step="0.5"
                              disabled={onlyFresher}
                            />
                          )}
                        />
                        <span className='toSeprate'>To</span>
                        <Controller
                          name="maxExperience"
                          control={control}
                          render={({ field }) => (
                            <input
                              type="number"
                              className={`form-control ${errors.maxExperience ? 'is-invalid' : ''}`}
                              placeholder="Max (years)"
                              value={field.value}
                              onChange={(e) => {
                                const value = e.target.value;
                                // Ensure non-negative
                                if (parseFloat(value) < 0 && value !== '') return;
                                field.onChange(value);
                              }}
                              onBlur={field.onBlur}
                              min="0"
                              step="0.5"
                              disabled={onlyFresher}
                            />
                          )}
                        />
                      </div>
                      <div className="form-check mt-2">
                        <Controller
                          name="onlyFresher"
                          control={control}
                          render={({ field }) => (
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        />
                        <label className="form-check-label">Only Freshers (0 experience)</label>
                      </div>
                      {errors.minExperience && <div className="text-danger small">{errors.minExperience.message}</div>}
                      {errors.maxExperience && <div className="text-danger small">{errors.maxExperience.message}</div>}
                    </div>
                  </div>

                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Salary & benefits<span className='redastric'>*</span></label>
                      <div className="d-grid gap-2 d-md-flex roundbtn">
                        <Controller
                          name="salaryBenefits"
                          control={control}
                          render={({ field }) => (
                            <>
                              <button
                                className={`btn ${field.value === 'Fixed' ? 'btn-primary selected' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('Fixed')}
                              >
                                Fixed
                              </button>
                              <button
                                className={`btn ${field.value === 'Fixed + Incentives' ? 'btn-primary selected' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('Fixed + Incentives')}
                              >
                                Fixed + Incentives
                              </button>
                            </>
                          )}
                        />
                      </div>
                      {errors.salaryBenefits && <div className="text-danger small">{errors.salaryBenefits.message}</div>}
                    </div>
                  </div>

                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Salary details/ monthly<span className='redastric'>*</span></label>
                      <div className="mutipleSelctBox">
                        <Controller
                          name="salaryMin"
                          control={control}
                          render={({ field }) => (
                            <input
                              type="number"
                              className={`form-control ${errors.salaryMin ? 'is-invalid' : ''}`}
                              placeholder="Min (₹)"
                              value={field.value}
                              onChange={(e) => {
                                const value = e.target.value;
                                // Ensure non-negative
                                if (parseFloat(value) < 0 && value !== '') return;
                                field.onChange(value);
                              }}
                              onBlur={field.onBlur}
                              min="0"
                              step="100"
                            />
                          )}
                        />
                        <span className='toSeprate'>To</span>
                        <Controller
                          name="salaryMax"
                          control={control}
                          render={({ field }) => (
                            <input
                              type="number"
                              className={`form-control ${errors.salaryMax ? 'is-invalid' : ''}`}
                              placeholder="Max (₹)"
                              value={field.value}
                              onChange={(e) => {
                                const value = e.target.value;
                                // Ensure non-negative
                                if (parseFloat(value) < 0 && value !== '') return;
                                field.onChange(value);
                              }}
                              onBlur={field.onBlur}
                              min="0"
                              step="100"
                            />
                          )}
                        />
                      </div>
                      {errors.salaryMin && <div className="text-danger small">{errors.salaryMin.message}</div>}
                      {errors.salaryMax && <div className="text-danger small">{errors.salaryMax.message}</div>}
                      {errors.salaryMax?.type === 'salary-range' && (
                        <div className="text-danger small">{errors.salaryMax.message}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Job Benefits (optional)</label>
                      <Controller
                        name="benefits"
                        control={control}
                        render={({ field }) => (
                          <MultiSelectWithServerSearch
                            placeholder="Search Job Benefits"
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            fetchOptions={(input: any, config: any) =>
                              masterBenifitsService(input, config)
                            }
                            isMulti
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Job Skills (optional)</label>
                      <Controller
                        name="skills"
                        control={control}
                        render={({ field }) => (
                          <MultiSelectWithServerSearch
                            placeholder="Search Skills"
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            fetchOptions={(input: any, config: any) =>
                              masterJobSKillsService(input, config)
                            }
                            isMulti
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Documents Required (optional)</label>
                      <Controller
                        name="documents"
                        control={control}
                        render={({ field }) => (
                          <MultiSelectWithServerSearch
                            placeholder="Search Documents Required"
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            fetchOptions={(input: any, config: any) =>
                              masterDocumentsService(input, config)
                            }
                            isMulti
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Timings & Working Days */}
                <div className='row'>
                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Job Timings<span className='redastric'>*</span></label>
                      <div className="mutipleSelctBox">
                        <Controller
                          name="minJobTiming"
                          control={control}
                          render={({ field }) => (
                            <input
                              type="number"
                              className={`form-control ${errors.minJobTiming ? 'is-invalid' : ''}`}
                              placeholder="Start time (e.g., 9)"
                              value={field.value}
                              onChange={(e) => {
                                const value = e.target.value;
                                const num = parseFloat(value);
                                // Validate range
                                if ((num < 0 || num > 24) && value !== '') return;
                                field.onChange(value);
                              }}
                              onBlur={field.onBlur}
                              min="0"
                              max="24"
                              step="0.5"
                            />
                          )}
                        />
                        <span className='toSeprate'>To</span>
                        <Controller
                          name="maxJobTiming"
                          control={control}
                          render={({ field }) => (
                            <input
                              type="number"
                              className={`form-control ${errors.maxJobTiming ? 'is-invalid' : ''}`}
                              placeholder="End time (e.g., 18)"
                              value={field.value}
                              onChange={(e) => {
                                const value = e.target.value;
                                const num = parseFloat(value);
                                // Validate range
                                if ((num < 0 || num > 24) && value !== '') return;
                                field.onChange(value);
                              }}
                              onBlur={field.onBlur}
                              min="0"
                              max="24"
                              step="0.5"
                            />
                          )}
                        />
                      </div>
                      {errors.minJobTiming && <div className="text-danger small">{errors.minJobTiming.message}</div>}
                      {errors.maxJobTiming && <div className="text-danger small">{errors.maxJobTiming.message}</div>}
                      {errors.maxJobTiming?.type === 'timing-range' && (
                        <div className="text-danger small">{errors.maxJobTiming.message}</div>
                      )}
                    </div>
                  </div>

                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Working Days<span className='redastric'>*</span></label>
                      <div className="d-grid gap-2 d-md-flex roundbtn">
                        <Controller
                          name="workingDays"
                          control={control}
                          render={({ field }) => (
                            <>
                              <button
                                className={`btn ${field.value === '5' ? 'btn-primary active' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('5')}
                              >
                                5 days working <IoCheckmark />
                              </button>
                              <button
                                className={`btn ${field.value === '6' ? 'btn-primary active' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('6')}
                              >
                                6 days working <GoPlus />
                              </button>
                            </>
                          )}
                        />
                      </div>
                      {errors.workingDays && <div className="text-danger small">{errors.workingDays.message}</div>}
                    </div>
                  </div>

                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Shift<span className='redastric'>*</span></label>
                      <div className="d-grid gap-2 d-md-flex roundbtn">
                        <Controller
                          name="shift"
                          control={control}
                          render={({ field }) => (
                            <>
                              <button
                                className={`btn ${field.value === 'Day' ? 'btn-primary selected' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('Day')}
                              >
                                Day
                              </button>
                              <button
                                className={`btn ${field.value === 'Night' ? 'btn-primary selected' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('Night')}
                              >
                                Night
                              </button>
                              <button
                                className={`btn ${field.value === 'Any' ? 'btn-primary selected' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('Any')}
                              >
                                Any
                              </button>
                            </>
                          )}
                        />
                      </div>
                      {errors.shift && <div className="text-danger small">{errors.shift.message}</div>}
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-md-12'>
                    <div className="mb-3">
                      <label className="form-label">Full Interview Address<span className='redastric'>*</span></label>
                      <Controller
                        name="interviewAddress"
                        control={control}
                        render={({ field }) => (
                          <input
                            type="text"
                            className={`form-control ${errors.interviewAddress ? 'is-invalid' : ''}`}
                            placeholder="Enter complete interview address"
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                          />
                        )}
                      />
                      {errors.interviewAddress && <div className="text-danger small">{errors.interviewAddress.message}</div>}
                    </div>
                  </div>
                </div>

                {/* Communication Preferences */}
                <div className='row'>
                  <div className='col-md-12'>
                    <div className="mb-3 form-check">
                      <Controller
                        name="candidateCanCall"
                        control={control}
                        render={({ field }) => (
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                      <label className="form-check-label">
                        Allow candidates to call between 10:00 am - 07:00 pm on 7275458171
                        <span className='blueedit'> (Edit)</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-md-12'>
                    <div className="mb-3">
                      <label className="form-label">
                        Is candidate required to make any deposit (e.g. uniform charges, delivery bag, etc)?
                        <span className='redastric'>*</span>
                      </label>
                      <div className="d-grid gap-2 d-md-flex roundbtn">
                        <Controller
                          name="depositRequired"
                          control={control}
                          render={({ field }) => (
                            <>
                              <button
                                className={`btn ${field.value === 'Yes' ? 'btn-primary active' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('Yes')}
                              >
                                Yes
                              </button>
                              <button
                                className={`btn ${field.value === 'No' ? 'btn-primary active' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('No')}
                              >
                                No
                              </button>
                            </>
                          )}
                        />
                      </div>
                      {errors.depositRequired && <div className="text-danger small">{errors.depositRequired.message}</div>}
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Assets Required (optional)</label>
                      <Controller
                        name="assetsRequired"
                        control={control}
                        render={({ field }) => (
                          <MultiSelectWithServerSearch
                            placeholder="Search Assets Required"
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            fetchOptions={(input: any, config: any) =>
                              masterAssetsRequiredService(input, config)
                            }
                            isMulti
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Generate Suggested Template */}
                <div className="mb-3 text-end">
                  
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => {
                      const values = getValues();
                      console.log("Generating template with values:", values);
                      const template = generateJobDescription(values);
                      setSuggestedTemplate(template);
                    }}
                  >
                    Generate Suggested Template
                  </button>
                </div>

                {/* Suggested Template textarea */}
                {suggestedTemplate && (
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label className="form-label mb-0">Suggested Template</label>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => {
                          setValue("description", suggestedTemplate, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                          setSuggestedTemplate("");
                        }}
                      >
                        Apply
                      </button>
                    </div>
                    <div
                      className="form-control"
                      style={{
                        minHeight: "220px",
                        overflowY: "auto",
                        backgroundColor: "#f8f9fa",
                      }}
                      dangerouslySetInnerHTML={{ __html: suggestedTemplate }}
                    />
                  </div>
                )}

                {/* Job Description */}
                <div className="row">
                  <div className="col-md-12 mb-5">
                    <label className="form-label">Job Description<span className='redastric'>*</span></label>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <RichTextEditor
                          description={field.value}
                          setDescription={field.onChange}
                          onBlur={field.onBlur}
                        />
                      )}
                    />
                    {errors.description && <div className="text-danger small">{errors.description.message}</div>}
                  </div>
                </div>

                <div className='row'>
                  <div className='col-md-12'>
                    <div className='submitBtn'>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting || loading}
                      >
                        {isSubmitting || loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            {isEditing ? 'Updating...' : 'Posting...'}
                          </>
                        ) : (
                          isEditing ? 'Update Job' : 'Post this job'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterJob;