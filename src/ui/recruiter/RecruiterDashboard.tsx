"use client"
import React, { useEffect, useState } from 'react'
import Link from "next/link";
import { MdInfoOutline } from "react-icons/md";
import { MdOutlineFileUpload } from "react-icons/md";
import { FiBriefcase } from "react-icons/fi";
import { FaRegClock } from "react-icons/fa";
import { useSession, useUser } from '@/hooks/useSession';
import { getRecruiterDashboard } from '@/services/RecruiterService';
import Loader from '../common/loader/Loader';
import RecruiterDocumentUploadModal from '../common/modal/RecruiterDocumentUploadModal';

const RecruiterDashboard = () => {
  const [sessionData, setSessionData] = useState<any>(null);
  const [modalShow, setModalShow] = React.useState(false);

  const user = useUser();

  const session = useSession();
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(false)
  useEffect(() => {
    fetchData()
  }, [refresh])

  const fetchData = async () => {
    if (session?.user?.user_id) {
      setLoading(true)
      const result = await getRecruiterDashboard(session?.user?.user_id)
      setSessionData(result?.data)
      setLoading(false)
    }
  }

  // Calculate progress based on verification steps
  const calculateProgress = () => {
    if (!sessionData) return 0;
    const steps = [
      sessionData?.isAccountCreated === 1,
      sessionData?.firstJobVerified === 1,
      sessionData?.isEmailVerified === 1,
      sessionData?.documentSubmission === 1,
      sessionData?.isVerified === 1
    ];
    const completedSteps = steps.filter(Boolean).length;
    return (completedSteps / steps.length) * 100;
  };

  const progressPercentage = calculateProgress();

  return (
    <div className='recruiter-wrapper'>
      {loading && <Loader />}
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

                  {/* Dynamic Progress Bar */}
                  <div className="progress">
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      aria-label="Verification progress"
                      style={{ width: `${progressPercentage}%` }}
                      aria-valuenow={progressPercentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      {/* {Math.round(progressPercentage)}% */}
                    </div>
                  </div>

                  <div className='card-content'>
                    <div className='checkboxText'>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={sessionData?.isAccountCreated === 1}
                        readOnly
                        id="accountCreated"
                      />
                      <span>Create an account</span>
                    </div>
                    <div className='buttonstatus'>
                      <span
                        className={`statusbtn ${sessionData?.isAccountCreated === 1 ? "btn-warning completed" : "btn-danger"}`}
                      >
                        {sessionData?.isAccountCreated === 1 ? "Completed" : "InCompleted"}
                      </span>
                    </div>
                    <div className='lastbtn'></div>
                  </div>

                  <div className='card-content'>
                    <div className='checkboxText'>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={sessionData?.firstJobVerified === 1}
                        readOnly
                        id="firstJobVerified"
                      />
                      <span>Post your first job</span>
                    </div>
                    <div className='buttonstatus'>
                      <span
                        className={`statusbtn ${sessionData?.firstJobVerified === 1 ? "btn-warning completed" : "btn-danger"}`}
                      >
                        {sessionData?.firstJobVerified === 1 ? "Verified" : (
                          <>
                            Under Review
                            <img src="/assets/images/caution.svg" alt="Under Review" />
                          </>
                        )}
                      </span>
                    </div>
                    <div className='lastbtn'><Link href="/recruiter/job/list/">View</Link></div>
                  </div>

                  <div className='card-content'>
                    <div className='checkboxText'>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={sessionData?.isEmailVerified === 1}
                        readOnly
                        id="emailVerified"
                      />
                      <span>Email Verification</span>
                    </div>
                    <div className='buttonstatus'>
                      <span
                        className={`statusbtn ${sessionData?.isEmailVerified === 1 ? "btn-warning completed" : "btn-danger"}`}
                      >
                        {sessionData?.isEmailVerified === 1 ? "Completed" : "InCompleted"}
                      </span>
                    </div>
                    <div className='lastbtn'></div>
                  </div>

                  <div className='card-content'>
                    <div className='checkboxText'>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={sessionData?.documentSubmission === 1}
                        readOnly
                        id="documentSubmission"
                      />
                      <span>Document Submission</span>
                    </div>
                    <div className='buttonstatus'>
                      <span
                        className={`statusbtn ${sessionData?.documentSubmission === 1 ? "btn-warning completed" : "btn-danger"}`}
                      >
                        {sessionData?.documentSubmission === 1 ? "Started" : "Not Started"}
                      </span>
                    </div>
                    <div className='lastbtn'>
                      <Link href="#" onClick={() => setModalShow(true)}>
                        <span className='infoicon' ><MdOutlineFileUpload /></span> Upload
                      </Link>
                      <RecruiterDocumentUploadModal
                        show={modalShow}
                        onHide={() => {setModalShow(false);setRefresh(true)}} 
                      />
                    </div>
                  </div>

                  <div className='card-content'>
                    <div className='checkboxText'>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={sessionData?.isVerified === 1}
                        readOnly
                        id="isVerified"
                      />
                      <span>Verification</span>
                    </div>
                    <div className='buttonstatus'>
                      <span
                        className={`statusbtn ${sessionData?.isVerified === 1 ? "btn-warning completed" : "btn-danger"}`}
                      >
                        {sessionData?.isVerified === 1 ? "Completed" : "Pending"}
                      </span>
                    </div>
                    <div className='lastbtn'>
                      <Link href="#">
                        <span className='infoicon'><MdInfoOutline /></span> Info
                      </Link>
                    </div>
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
                  <span className='kpiNumnber'>{sessionData?.liveJob || 0}</span>
                </div>
              </div>
            </div>

            <div className='col-md-3'>
              <div className='kpiBoxArea'>
                <div className='iconKpi'><FaRegClock /></div>
                <div className='contentKpi'>
                  <span className='kpiText'>Under Review Jobs</span>
                  <span className='kpiNumnber'>{sessionData?.underReviewJob || 0}</span>
                </div>
              </div>
            </div>

            <div className='col-md-3'>
              <div className='kpiBoxArea'>
                <div className='iconKpi'><img src="/assets/images/coin.png" /></div>
                <div className='contentKpi'>
                  <span className='kpiText'>Credits</span>
                  <span className='kpiNumnber'>{sessionData?.credits || 0}</span>
                </div>
              </div>
            </div>

            <div className='col-md-3'>
              <div className='kpiBoxArea'>
                <div className='iconKpi'><FiBriefcase /></div>
                <div className='contentKpi'>
                  <span className='kpiText'>Pending Candidates</span>
                  <span className='kpiNumnber'>{sessionData?.pendingCandidate || 0}</span>
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