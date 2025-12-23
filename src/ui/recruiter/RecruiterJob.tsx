'use client'
import React, { useEffect, useState } from 'react'
import { GoPlus } from "react-icons/go";
import { IoCheckmark } from "react-icons/io5";
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
import ServerSearchSelect from '@/components/Common/SearchableSelect';
import MultiSelectWithServerSearch from '@/components/Common/MultiSelectWithServerSearch';
import RichTextEditor from '@/components/Common/RichTextEditors';

const RecruiterJob = () => {

  const [jobTitle, setJobTitle] = useState(null);
  const [category, setCategory] = useState(null);
  const [city, setCity] = useState(null);
  const [locality, setLocality] = useState(null);

  const [benefits, setBenefits] = useState([]);
  const [skills, setSkills] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [assetsRequired, setAssetsRequired] = useState([]);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState(null)
  console.log(description);
  
  return (
    <div className='jobposting'>
      {loading && <Loader />}
      <div className='container'>
        <div className='row'>
          <div className='col-md-12'>
            <form>
              <div className='formsection'>
                <div className='row'>
                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Job Title<span className='redastric'>*</span></label>
                      <ServerSearchSelect
                        placeholder="Search job title"
                        value={jobTitle}
                        onChange={setJobTitle}
                        fetchOptions={(input: any, config: any) =>
                          masterJobTitleService(input, config)
                        }
                      />
                    </div>
                  </div>

                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Job Category<span className='redastric'>*</span></label>
                      <ServerSearchSelect
                        placeholder="Search job Category"
                        value={category}
                        onChange={setCategory}
                        fetchOptions={(input: any, config: any) =>
                          masterCategoryService(input, config)
                        }
                      />
                    </div>
                  </div>

                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Number of Openings<span className='redastric'>*</span></label>
                      <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="e.g. 1" />
                    </div>
                  </div>


                </div>

                <div className='row'>
                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Job Type<span className='redastric'>*</span></label>
                      <div className="d-grid gap-2 d-md-flex roundbtn">
                        <button className="btn btn-primary selected" type="button">Full Time</button>
                        <button className="btn btn-primary" type="button">Part Time</button>
                      </div>
                      <div className="mb-3 form-check">
                        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                        <label className="form-check-label">It is a Contract Job </label>
                      </div>

                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Work Location Type<span className='redastric'>*</span></label>
                      <div className="d-grid gap-2 d-md-flex roundbtn">
                        <button className="btn btn-primary selected" type="button">Work from office</button>
                        <button className="btn btn-primary" type="button">Field job</button>
                        <button className="btn btn-primary" type="button">Work from home</button>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Choose City<span className='redastric'>*</span></label>
                      <ServerSearchSelect
                        placeholder="Search City"
                        value={city}
                        onChange={setCity}
                        fetchOptions={(input: any, config: any) =>
                          masterCityService(input, config)
                        }
                      />
                    </div>
                  </div>

                </div>

                <div className='row'>
                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Job Locality<span className='redastric'>*</span></label>
                      <ServerSearchSelect
                        placeholder="Search Locality"
                        value={locality}
                        onChange={setLocality}
                        fetchOptions={(input: any, config: any) =>
                          masterLocalityService(input, config)
                        }
                      />
                    </div>
                  </div>

                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Gender<span className='redastric'>*</span></label>
                      <div className="d-grid gap-2 d-md-flex roundbtn">
                        <button className="btn btn-primary selected" type="button">Any</button>
                        <button className="btn btn-primary" type="button">Male</button>
                        <button className="btn btn-primary" type="button">Female</button>
                      </div>
                    </div>
                  </div>

                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Minimum Qualification Required<span className='redastric'>*</span></label>
                      <div className="d-grid gap-2 d-md-flex roundbtn">
                        <button className="btn btn-primary" type="button">Any</button>
                        <button className="btn btn-primary" type="button">10th Pass</button>
                        <button className="btn btn-primary" type="button">12th Pass</button>
                        <button className="btn btn-primary" type="button">Diploma</button>
                        <button className="btn btn-primary" type="button">Graduate</button>
                        <button className="btn btn-primary" type="button">Post Graduate</button>
                      </div>
                    </div>
                  </div>

                </div>

                <div className='row'>
                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Required Experience<span className='redastric'>*</span></label>
                      <div className="mutipleSelctBox">
                        <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="e.g. 1" />
                        <span className='toSeprate'>To</span>
                        <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="e.g. 1" />
                      </div>

                    </div>
                  </div>

                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Salary & benefits<span className='redastric'>*</span></label>
                      <div className="d-grid gap-2 d-md-flex roundbtn">
                        <button className="btn btn-primary" type="button">Fixed</button>
                        <button className="btn btn-primary" type="button">Fixed + Incentives</button>
                      </div>
                    </div>
                  </div>

                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Salary details/ monthly<span className='redastric'>*</span></label>
                      <div className="mutipleSelctBox">
                        <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="e.g. 1" />
                        <span className='toSeprate'>To</span>
                        <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="e.g. 1" />
                      </div>
                    </div>
                  </div>


                </div>

                <div className='row'>
                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Job Benefits (optional)</label>
                      <MultiSelectWithServerSearch
                        placeholder="Search Job Benefits"
                        value={benefits}
                        onChange={setBenefits}
                        fetchOptions={(input, config) =>
                          masterBenifitsService(input, config)
                        }
                        isMulti
                      />

                    </div>
                  </div>

                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Job Skills (optional)</label>
                      <MultiSelectWithServerSearch
                        placeholder="Search Skills"
                        value={skills}
                        onChange={setSkills}
                        fetchOptions={(input, config) =>
                          masterJobSKillsService(input, config)
                        }
                        isMulti
                      />

                    </div>
                  </div>

                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Documents Required(optional)</label>
                      <MultiSelectWithServerSearch
                        placeholder="Search Documents Required"
                        value={documents}
                        onChange={setDocuments}
                        fetchOptions={(input, config) =>
                          masterDocumentsService(input, config)
                        }
                        isMulti
                      />

                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Job Timings<span className='redastric'>*</span></label>
                      <div className="mutipleSelctBox">
                        <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="" />
                        <span className='toSeprate'>To</span>
                        <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="" />
                      </div>
                    </div>
                  </div>

                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Working Days<span className='redastric'>*</span></label>
                      <div className="d-grid gap-2 d-md-flex roundbtn">
                        <button className="btn btn-primary active" type="button">5 days working <IoCheckmark /></button>
                        <button className="btn btn-primary" type="button">6 days working <GoPlus /></button>
                      </div>
                    </div>
                  </div>

                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Full Interview Address<span className='redastric'>*</span></label>
                      <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="" />
                    </div>
                  </div>

                </div>

                <div className='row'>
                  <div className='col-md-12'>
                    <div className="mb-3 form-check">
                      <input className="form-check-input" id="exampleCheck1" type="checkbox" />
                      <label className="form-check-label">Allow candidates to call between 10:00 am - 07:00 pm on 7275458171 <span className='blueedit'>(Edit)</span> </label>
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-md-12'>
                    <div className="mb-3">
                      <label className="form-label">Is candidate required to make any deposit (e.g. uniform charges, delivery bag, etc)?<span className='redastric'>*</span></label>
                      <div className="d-grid gap-2 d-md-flex roundbtn">
                        <button className="btn btn-primary active" type="button">Yes</button>
                        <button className="btn btn-primary" type="button">No</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-md-4'>
                    <div className="mb-3">
                      <label className="form-label">Assets Required(optional)</label>
                      <MultiSelectWithServerSearch
                        placeholder="Search Assets Required"
                        value={assetsRequired}
                        onChange={setAssetsRequired}
                        fetchOptions={(input, config) =>
                          masterAssetsRequiredService(input, config)
                        }
                        isMulti
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 mb-5">
                     <RichTextEditor description={description} setDescription={setDescription} />

                  </div>
                </div>
                <div className='row'>
                  <div className='col-md-12'>
                    <div className='submitBtn'>
                      <button type="button" className="btn btn-primary">Post this job</button>
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
