"use client"
import React from 'react'
import Link from "next/link";
import { MdInfoOutline } from "react-icons/md";
import { MdOutlineFileUpload } from "react-icons/md";
import { FiBriefcase } from "react-icons/fi";
import { FaRegClock } from "react-icons/fa";
import { useUser } from '@/hooks/useSession';
const RecruiterDashboard = () => {
  const user =useUser();
  return (
    <div className='recruiter-wrapper'>
     <div className='content-recruiter'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='welcomeheading'>
                <h1>Welcome back,  {user?.user_fullName || "Guest User"}!</h1>
                <Link href="#" className="btn btn-primary">Post a Job</Link>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-md-12'>
              <div className='pramotion-banner'>
                <div id="carouselExampleCaptions" className="carousel slide">
                  <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                  </div>
                  <div className="carousel-inner">
                    <div className="carousel-item active">
                      
                      <img src="/assets/images/recruiter-banner.jpg" className="d-block w-100" alt="..." />
                      <div className="carousel-caption d-none d-md-block">
                        <h5>See what's new on STAFF BRIDGES!</h5>
                        <p>A platform you know and love, now faster and smarter.</p>
                      </div>
                    </div>
                    <div className="carousel-item">
                      <img src="/assets/images/recruiter-banner.jpg" className="d-block w-100" alt="..." />
                      <div className="carousel-caption d-none d-md-block">
                        <h5>Smarter Hiring Starts Here</h5>
                        <p>Post jobs, connect with verified candidates, and streamline your recruitment process in one place.</p>
                      </div>
                    </div>
                    <div className="carousel-item">
                      <img src="/assets/images/recruiter-banner.jpg" className="d-block w-100" alt="..." />
                      <div className="carousel-caption d-none d-md-block">
                        <h5>Build Your Workforce with Confidence</h5>
                        <p>A powerful recruitment solution designed to help employers find the right talent at the right time.</p>
                      </div>
                    </div>
                  </div>
                  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-md-12'>
              <div className='verification-steps'>
                <div className='card'>
                      <div className='cardHeading'><img src="/assets/images/hugeicons_security-check.svg" />Verification Steps</div>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          aria-label="Segment two"
                          style={{ width: "30%" }}
                          aria-valuenow={30}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        ></div>
                      </div>
                      <div className='card-content'>
                        <div className='checkboxText'>
                          <input className="form-check-input" type="checkbox" value="" defaultChecked id="flexCheckDefault" />
                          <span>Create an account</span>
                        </div>
                        <div className='buttonstatus'>
                            <span className='statusbtn completed'>Completed</span>
                        </div>
                        <div className='lastbtn'></div>
                      </div>

                      <div className='card-content'>
                        <div className='checkboxText'>
                          <input className="form-check-input" type="checkbox" value="" defaultChecked id="flexCheckDefault" />
                          <span>Post your first job</span>
                        </div>
                        <div className='buttonstatus'>
                            <span className='statusbtn under-review'>Under Review <img src="/assets/images/caution.svg" /></span>
                        </div>
                        <div className='lastbtn'><Link href="#">View</Link></div>
                      </div>

                      <div className='card-content'>
                        <div className='checkboxText'>
                          <input className="form-check-input" type="checkbox" value="" defaultChecked id="flexCheckDefault" />
                          <span>Email Verification</span>
                        </div>
                        <div className='buttonstatus'>
                            <span className='statusbtn completed'>Completed</span>
                        </div>
                        <div className='lastbtn'></div>
                      </div>

                      <div className='card-content'>
                        <div className='checkboxText'>
                          <input className="form-check-input" type="checkbox" value=""  id="flexCheckDefault" />
                          <span>Document Submission</span>
                        </div>
                        <div className='buttonstatus'>
                            <span className='statusbtn'>Not Started</span>
                        </div>
                        <div className='lastbtn'><Link href="#"><span className='infoicon'><MdOutlineFileUpload /></span> Upload</Link></div>
                      </div>

                      <div className='card-content'>
                        <div className='checkboxText'>
                          <input className="form-check-input" type="checkbox" value=""  id="flexCheckDefault" />
                          <span>Verification</span>
                        </div>
                        <div className='buttonstatus'>
                            <span className='statusbtn'>Pending</span>
                        </div>
                        <div className='lastbtn'><Link href="#"><span className='infoicon'><MdInfoOutline /></span> Info</Link></div>
                      </div>
                      
                  
                </div>
              </div>
            </div>

          </div>

          <div className='row'>            
            <div className='col-md-3'>
              <div className='kpiBoxArea'>
                <div className='iconKpi'><FiBriefcase /></div>
                <div className='contentKpi'>
                  <span className='kpiText'>Live Jobs</span>
                  <span className='kpiNumnber'>0</span>
                </div>
              </div>
            </div>

            <div className='col-md-3'>
              <div className='kpiBoxArea'>
                <div className='iconKpi'><FaRegClock /></div>
                <div className='contentKpi'>
                  <span className='kpiText'>Under Review Jobs</span>
                  <span className='kpiNumnber'>0</span>
                </div>
              </div>
            </div>

            <div className='col-md-3'>
              <div className='kpiBoxArea'>
                <div className='iconKpi'><img src="/assets/images/coin.png" /></div>
                <div className='contentKpi'>
                  <span className='kpiText'>Credits</span>
                  <span className='kpiNumnber'>0</span>
                </div>
              </div>
            </div>

            <div className='col-md-3'>
              <div className='kpiBoxArea'>
                <div className='iconKpi'><FiBriefcase /></div>
                <div className='contentKpi'>
                  <span className='kpiText'>Pending Candidates</span>
                  <span className='kpiNumnber'>0</span>
                </div>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-md-6'>
              <div className='gradientBox contactus'>
                <div className='gradientbg'>
                  <h3>Contact Us</h3>
                  <p>Get Dedicated Support from our support team</p>
                  <div className='buttonImage'>
                    <Link href="#" className='btn btn-outline-secondary'>Contact us</Link>
                    <img src="/assets/images/phone-call.png" />
                  </div>
                </div>
              </div>

            </div>
            <div className='col-md-6'>
              <div className='gradientBox contactus'>
                <div className='gradientbg'>
                  <h3>Refer Us</h3>
                  <p>Tell other recruiters about us and help them hire faster</p>
                  <div className='buttonImage'>
                    <Link href="#" className='btn btn-outline-secondary'>Refer us</Link>
                    <img src="/assets/images/megaphone.png" />
                  </div>
                </div>
              </div>

            </div>
          </div>


        </div>
      </div>
    </div>
  )
}

export default RecruiterDashboard
