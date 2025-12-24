"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Loader from "@/ui/common/loader/Loader";
import { getRecruiterJobList } from "@/services/RecruiterService";

interface JobItem {
  job_id: number;
  job_title_name: string;
  status: string;
  locality_name: string;
  city_name: string;
  salary_min: string;
  salary_max: string;
  openings: number;
  created_at: string;
}

const RecruiterJobList = () => {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchJobs(page);
  }, [page]);

  const fetchJobs = async (currentPage: number) => {
    try {
      setLoading(true);
      const res = await getRecruiterJobList(currentPage, limit);

      if (res?.success) {
        setJobs(res.data.items || []);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching job list", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="jobposting">
      {loading && <Loader />}

      <div className="container">
        <div className="row">
          <div className="col-md-12">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-0">Jobs</h4>

              <Link href="/recruiter/job">
                <button className="btn btn-primary">
                  Post a Job
                </button>
              </Link>
            </div>

            {/* Job List */}
            {jobs.map((job) => (
              <div key={job.job_id} className="formsection mb-4">
                <div className="row">
                  <div className="col-md-12">

                    {/* Title Row */}
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="mb-1">
                          {job.job_title_name}
                          <span className="badge bg-warning text-dark ms-2">
                            {job.status}
                          </span>
                        </h5>

                        <p className="text-muted small mb-2">
                          {job.locality_name}, {job.city_name} &nbsp; | &nbsp;
                          ₹{Number(job.salary_min).toLocaleString()} - ₹
                          {Number(job.salary_max).toLocaleString()} &nbsp; | &nbsp;
                          {job.openings} opening
                        </p>
                      </div>

                      <span className="text-muted small">
                        {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* CTA */}
                    <div className="d-flex align-items-center mt-3">
                      <button className="btn btn-outline-primary me-2">
                        0 To Review
                      </button>

                      <button className="btn btn-outline-primary me-2">
                        0 Contacted
                      </button>

                      <div className="ms-auto">
                        <button className="btn btn-primary">
                          View All Candidates
                        </button>
                      </div>
                    </div>

                    {/* Footer info */}
                    <div className="mt-3 text-muted small">
                      👉 We will call you in the next 4 hours (10 a.m. – 6:30 p.m.)
                    </div>

                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {!loading && jobs.length === 0 && (
              <div className="text-center text-muted mt-5">
                No jobs posted yet.
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="mt-4">
                <ul className="pagination justify-content-center">

                  <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    >
                      Previous
                    </button>
                  </li>

                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <li
                        key={pageNumber}
                        className={`page-item ${page === pageNumber ? "active" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setPage(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      </li>
                    );
                  })}

                  <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    >
                      Next
                    </button>
                  </li>

                </ul>
              </nav>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterJobList;
