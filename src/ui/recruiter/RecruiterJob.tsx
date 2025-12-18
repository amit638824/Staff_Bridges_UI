import React from 'react'
import { GoPlus } from "react-icons/go";
import { IoCheckmark } from "react-icons/io5";

const RecruiterJob = () => {
  return (
    <div className='jobposting'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-12'>
            <form>
            <div className='formsection'>
              <div className='row'>
                <div className='col-md-4'>
                  <div className="mb-3">
                    <label className="form-label">Job Title<span className='redastric'>*</span></label>
                    <select className="form-select" aria-label="Default select example">
                      <option value="" disabled>Select job title</option>
                      <option selected>Select job title</option>
                      <option value="1">2-wheeler Macahanic</option>
                      <option value="2">2D Animator</option>
                      <option value="3">2D/3D Architect</option>
                    </select>
                  </div>
                </div>

                <div className='col-md-4'>
                  <div className="mb-3">
                    <label className="form-label">Job Category<span className='redastric'>*</span></label>
                    <select className="form-select" aria-label="Default select example">
                      <option value="" disabled>Select job category</option>
                      <option value="1">2-wheeler Macahanic</option>
                      <option value="2">2D Animator</option>
                      <option value="3">2D/3D Architect</option>
                    </select>
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
                    <select className="form-select" aria-label="Default select example">
                      <option value="" disabled>Select city</option>
                      <option value="1">Lucknow</option>
                      <option value="2">Barabanki</option>
                      <option value="3">Gonda</option>
                    </select>
                  </div>
                </div>

              </div>

              <div className='row'>
                <div className='col-md-4'>
                  <div className="mb-3">
                    <label className="form-label">Job Locality<span className='redastric'>*</span></label>
                    <select className="form-select" aria-label="Default select example">
                      <option value="" disabled>Select locality</option>
                      <option value="1">Lucknow</option>
                      <option value="2">Barabanki</option>
                      <option value="3">Gonda</option>
                    </select>
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
                      <select className="form-select" aria-label="Default select example">
                        <option value="" disabled>Min Exp.</option>
                        <option value="1">Lucknow</option>
                        <option value="2">Barabanki</option>
                        <option value="3">Gonda</option>
                      </select>
                      <span className='toSeprate'>To</span>
                      <select className="form-select" aria-label="Default select example">
                        <option value="" disabled>Max Exp.</option>
                        <option value="1">Lucknow</option>
                        <option value="2">Barabanki</option>
                        <option value="3">Gonda</option>
                      </select>
                    </div>
                    <div className="mb-3 form-check">
                      <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                      <label className="form-check-label">It is a Contract Job </label>
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
                    <div className="d-grid gap-2 d-md-flex roundbtn">
                      <button className="btn btn-primary active" type="button">Car <IoCheckmark /></button>
                      <button className="btn btn-primary" type="button">Meal <GoPlus /></button>
                      <button className="btn btn-primary" type="button">Insurance <GoPlus /></button>
                      <button className="btn btn-primary" type="button">PF <GoPlus /></button>
                      <button className="btn btn-primary" type="button">Medical Benefits <GoPlus /></button>
                      <button className="btn btn-primary" type="button">Add More <GoPlus /></button>
                    </div>
                  </div>
                </div>

                <div className='col-md-4'>
                  <div className="mb-3">
                    <label className="form-label">Job Skills (optional)</label>
                    <div className="d-grid gap-2 d-md-flex roundbtn">
                      <button className="btn btn-primary active" type="button">3D Modelling <IoCheckmark /></button>
                      <button className="btn btn-primary" type="button">AutoCad <GoPlus /></button>
                      <button className="btn btn-primary" type="button">Interior Design <GoPlus /></button>
                      <button className="btn btn-primary" type="button">PhotoShop <GoPlus /></button>
                      <button className="btn btn-primary" type="button">Revit <GoPlus /></button>
                      <button className="btn btn-primary" type="button">Site Survey <GoPlus /></button>
                      <button className="btn btn-primary" type="button">SketchUp <GoPlus /></button>
                      <button className="btn btn-primary" type="button">Add more <GoPlus /></button>
                    </div>
                  </div>
                </div>

                <div className='col-md-4'>
                  <div className="mb-3">
                    <label className="form-label">Job Skills (optional)</label>
                    <div className="d-grid gap-2 d-md-flex roundbtn">
                      <button className="btn btn-primary active" type="button">ITI <IoCheckmark /></button>
                      <button className="btn btn-primary" type="button">PAN Card <GoPlus /></button>
                      <button className="btn btn-primary" type="button">Aadhar Card <GoPlus /></button>
                      <button className="btn btn-primary" type="button">Bank Account <GoPlus /></button>
                    </div>
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
