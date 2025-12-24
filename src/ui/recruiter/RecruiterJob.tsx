'use client'
import React, { useEffect, useState } from 'react'
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
import { JobPostService } from "@/services/RecruiterService";
import ServerSearchSelect from '@/components/Common/SearchableSelect';
import MultiSelectWithServerSearch from '@/components/Common/MultiSelectWithServerSearch';
import RichTextEditor from '@/components/Common/RichTextEditors';
import { showAlert } from "@/utils/swalFire";
import { generateJobDescription } from "@/services/jobDescriptionTemplate";
import { useRouter } from "next/navigation";

interface SelectOption {
  value: number;
  label: string;
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
  description: string | null;
}

const RecruiterJob = () => {
  // Validation Schema - FIXED VERSION
  const validationSchema = yup.object({
    // Basic Information
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

    // Location & Demographics
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
      .test('experience-required', 'Minimum experience is required', function(value) {
        const onlyFresher = this.parent.onlyFresher;
        if (onlyFresher) return true;
        return !!(value && value.trim() !== '');
      })
      .test('is-number', 'Must be a valid number', function(value) {
        const onlyFresher = this.parent.onlyFresher;
        if (onlyFresher) return true;
        if (!value || value.trim() === '') return true;
        return !isNaN(parseFloat(value));
      }),
    
    maxExperience: yup
      .string()
      .test('experience-required', 'Maximum experience is required', function(value) {
        const onlyFresher = this.parent.onlyFresher;
        if (onlyFresher) return true;
        return !!(value && value.trim() !== '');
      })
      .test('is-number', 'Must be a valid number', function(value) {
        const onlyFresher = this.parent.onlyFresher;
        if (onlyFresher) return true;
        if (!value || value.trim() === '') return true;
        return !isNaN(parseFloat(value));
      })
      .test('experience-range', 'Minimum experience cannot be greater than maximum experience', function(value) {
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
      .test('salary-range', 'Minimum salary cannot be greater than maximum salary', function(value) {
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
      .test('timing-range', 'Start time must be less than end time', function(value) {
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
      .nullable()
      .required('Job description is required')
      .test('not-empty', 'Job description is required', (value:any) => {
        return value && value.trim().length > 0;
      }),
  });

  // Initialize form
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
    watch,
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema)  as any,
    defaultValues: {
      jobTitle: null,
      category: null,
      openings: '',
      jobType: 'Full-time',
      isContractJob: false,
      workLocation: 'Work from office',
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
      workingDays: '5 days working',
      shift: 'Day',
      minJobTiming: '',
      maxJobTiming: '',
      interviewAddress: '',
      candidateCanCall: false,
      communicationWindow: [],
      depositRequired: 'No',
      assetsRequired: [],
      description: null,
    },
    mode: 'onBlur',
  });

  // Watch certain fields for conditional logic
  const onlyFresher = useWatch({ control, name: 'onlyFresher' });
  const candidateCanCall = useWatch({ control, name: 'candidateCanCall' });
  const isContractJob = useWatch({ control, name: 'isContractJob' });
  const workLocation = useWatch({ control, name: 'workLocation' });
  const jobType = useWatch({ control, name: 'jobType' });
  const salaryBenefits = useWatch({ control, name: 'salaryBenefits' });

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
      // Format qualification according to database enum
      const formatQualification = (qual: string): string => {
        const map: Record<string, string> = {
          'Any': 'Any',
          '10th Pass': 'highschool',
          '12th Pass': 'intermediate',
          'Diploma': 'diploma',
          'Graduate': 'graduate',
          'Post Graduate': 'postgraduate'
        };
        return map[qual] || 'highschool';
      };

      // Determine job type based on contract job checkbox
      let finalJobType = data.jobType;
      if (data.isContractJob) {
        finalJobType = 'Contract';
      }

      // Format work location
      const formatWorkLocation = (location: string): string => {
        const map: Record<string, string> = {
          'Work from office': 'Office',
          'Field job': 'Field',
          'Work from home': 'WorkFromHome'
        };
        return map[location] || 'Office';
      };

      // Format working days
      const formatWorkingDays = (days: string): string => {
        const map: Record<string, string> = {
          '5 days working': '5',
          '6 days working': '6',
          'other': 'other'
        };
        return map[days] || '5';
      };

      const formData = {
        // Required fields from database
        recruiterId: 1, // This should come from auth/session
        titleId: data.jobTitle?.value,
        categoryId: data.category?.value,
        cityId: data.city?.value,
        localityId: data.locality?.value,
        
        // Other required fields with defaults
        hiringForOthers: 0,
        openings: parseInt(data.openings),
        agencyId: null,
        
        // Job type and location
        jobType: finalJobType,
        workLocation: formatWorkLocation(data.workLocation),
        
        // Demographics
        gender: data.gender,
        qualification: formatQualification(data.qualification),
        
        // Experience (converted to decimal for database)
        minExerince: data.onlyFresher ? 0 : parseFloat(data.minExperience),
        maxExperince: data.onlyFresher ? 0 : parseFloat(data.maxExperience),
        onlyFresher: data.onlyFresher ? 1 : 0,
        
        // Salary (converted to decimal)
        salaryBenifits: data.salaryBenefits,
        salaryMin: parseFloat(data.salaryMin),
        salaryMax: parseFloat(data.salaryMax),
        
        // Working days and shift
        workingDays: formatWorkingDays(data.workingDays),
        shift: data.shift,
        
        // Job timings (converted to decimal)
        minJobTiming: parseFloat(data.minJobTiming),
        maxJobTiming: parseFloat(data.maxJobTiming),
        
        // Deposit and verification
        depositeRequired: data.depositRequired === 'Yes' ? 1 : 0,
        verificationRequired: 0,
        
        // Interview and communication
        interviewAddress: data.interviewAddress,
        communicationWindow: data.communicationWindow,
        candidateCanCall: data.candidateCanCall ? 1 : 0,
        
        // Job posting type
        jobPostingFor: 'INDIVIDUAL',
        
        // Description and status
        description: data.description,
        status: 'DRAFT',
        adminComments: null,
        
        // Audit fields
        createdBy: 1,
        updatedBy: 1,
        
        // Arrays for related tables
        jobSkillsIds: data.skills.map(skill => skill.value),
        assetsIds: data.assetsRequired.map(asset => asset.value),
        documetnsIds: data.documents.map(doc => doc.value),
        jobBenitsIds: data.benefits.map(benefit => benefit.value)
      };

      console.log('Form data prepared for API:', formData); 
      const response = await JobPostService(formData);
      if (!response?.success) {
        return showAlert("error", response?.message, "Failed");
      }
      showAlert("success", response?.message, "Success");
      router.replace("/recruiter/job/list");

    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while posting the job');
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(false);
  const [suggestedTemplate, setSuggestedTemplate] = useState<string>("");
  const router = useRouter();

  return (
    <div className='jobposting'>
      {loading && <Loader />}
      <div className='container'>
        <div className='row'>
          <div className='col-md-12'>
            <form onSubmit={handleSubmit((data:any)=>onSubmit(data))} noValidate>
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
                            </>
                          )}
                        />
                      </div>
                      <div className="mb-3 form-check">
                        <Controller
                          name="isContractJob"
                          control={control}
                          render={({ field }) => (
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={field.value}
                              onChange={(e) => {
                                field.onChange(e.target.checked);
                                // If contract job is checked, set job type to Contract
                                if (e.target.checked) {
                                  setValue('jobType', 'Contract', { shouldValidate: true });
                                } else {
                                  setValue('jobType', 'Full-time', { shouldValidate: true });
                                }
                              }}
                              onBlur={field.onBlur}
                            />
                          )}
                        />
                        <label className="form-check-label">It is a Contract Job</label>
                      </div>
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
                                className={`btn ${field.value === 'Work from office' ? 'btn-primary selected' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('Work from office')}
                              >
                                Work from office
                              </button>
                              <button
                                className={`btn ${field.value === 'Field job' ? 'btn-primary selected' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('Field job')}
                              >
                                Field job
                              </button>
                              <button
                                className={`btn ${field.value === 'Work from home' ? 'btn-primary selected' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('Work from home')}
                              >
                                Work from home
                              </button>
                            </>
                          )}
                        />
                      </div>
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

                {/* Location & Demographics */}
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
                                className={`btn ${field.value === '10th Pass' ? 'btn-primary selected' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('10th Pass')}
                              >
                                10th Pass
                              </button>
                              <button
                                className={`btn ${field.value === '12th Pass' ? 'btn-primary selected' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('12th Pass')}
                              >
                                12th Pass
                              </button>
                              <button
                                className={`btn ${field.value === 'Diploma' ? 'btn-primary selected' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('Diploma')}
                              >
                                Diploma
                              </button>
                              <button
                                className={`btn ${field.value === 'Graduate' ? 'btn-primary selected' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('Graduate')}
                              >
                                Graduate
                              </button>
                              <button
                                className={`btn ${field.value === 'Post Graduate' ? 'btn-primary selected' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('Post Graduate')}
                              >
                                Post Graduate
                              </button>
                            </>
                          )}
                        />
                      </div>
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

                {/* Skills & Benefits */}
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
                            fetchOptions={(input:any, config:any) =>
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
                            fetchOptions={(input:any, config:any) =>
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
                            fetchOptions={(input:any, config:any) =>
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
                                className={`btn ${field.value === '5 days working' ? 'btn-primary active' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('5 days working')}
                              >
                                5 days working <IoCheckmark />
                              </button>
                              <button
                                className={`btn ${field.value === '6 days working' ? 'btn-primary active' : 'btn-outline-primary'}`}
                                type="button"
                                onClick={() => field.onChange('6 days working')}
                              >
                                6 days working <GoPlus />
                              </button>
                            </>
                          )}
                        />
                      </div>
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
                    </div>
                  </div>
                </div>

                {/* Interview Details */}
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

                {/* Deposit & Assets */}
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
                            fetchOptions={(input:any, config:any) =>
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
                        console.log("FORM VALUES USED:", values); // 👈 debug once
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

                {/* Submit Button */}
                <div className='row'>
                  <div className='col-md-12'>
                    <div className='submitBtn'>
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={isSubmitting || loading}
                      >
                        {isSubmitting || loading ? 'Posting...' : 'Post this job'}
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
  )
}

export default RecruiterJob