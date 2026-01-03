"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";

import Loader from "@/ui/common/loader/Loader";
import {
  getRecruiterJobList,
  deleteJobPstedServices,
} from "@/services/RecruiterService";
import { showAlert, showConfirmAlert } from "@/utils/swalFire";

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

const LIMIT = 10;

const RecruiterJobList = () => {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  /** FETCH JOB LIST */
  const fetchJobs = async (pageNo: number) => {
    try {
      setLoading(true);
      const res = await getRecruiterJobList(pageNo, LIMIT);

      if (res?.success) {
        setJobs(res?.data?.items || []);
        setTotalPages(res?.data?.totalPages || 1);
      }
    } catch (error) {
      console.error("Job fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(page);
  }, [page]);

  /** DELETE JOB */
  const handleDelete = async (id: number) => {
    const confirmed = await showConfirmAlert({
      title: "Delete Job?",
      text: "This action cannot be undone",
      confirmText: "Yes, delete",
    });

    if (!confirmed) return;

    try {
      const res = await deleteJobPstedServices(id);
      if (res?.success) {
        showAlert("success", res.message || "Deleted successfully");
        fetchJobs(page);
      } else {
        showAlert("error", res?.message || "Delete failed");
      }
    } catch (error: any) {
      showAlert("error", error?.message || "Server error");
    }
  };

  /** EDIT JOB */
  const handleJobEdit = (job: JobItem) => {
    localStorage.setItem("jobUpdate", JSON.stringify(job));
    router.push("/recruiter/job/update");
  };

  return (
    <div className="jobposting py-4">
      {loading && <Loader />}

      <div className="container">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Jobs</h4>
          <Link href="/recruiter/job">
            <button className="btn btn-primary">Post a Job</button>
          </Link>
        </div>

        {/* JOB LIST */}
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job.job_id} className="card shadow-sm mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h5 className="mb-1">
                      {job.job_title_name}
                      <span className="badge bg-warning text-dark ms-2">
                        {job.status}
                      </span>
                    </h5>

                    <p className="text-muted small mb-2">
                      {job.locality_name}, {job.city_name} | ₹
                      {Number(job.salary_min).toLocaleString()} - ₹
                      {Number(job.salary_max).toLocaleString()} |{" "}
                      {job.openings} openings
                    </p>
                  </div>

                  <div className="text-muted small text-end">
                    {new Date(job.created_at).toLocaleDateString()}
                    <div>
                      <FaEdit
                        className="text-warning me-3 cursor-pointer"
                        onClick={() => handleJobEdit(job)}
                      />
                      <FaTrashAlt
                        className="text-danger cursor-pointer"
                        onClick={() => handleDelete(job.job_id)}
                      />
                    </div>
                  </div>
                </div>

                <div className="d-flex mt-3">
                  <button className="btn btn-outline-primary me-2">
                    0 To Review
                  </button>
                  <button className="btn btn-outline-primary me-2">
                    0 Contacted
                  </button>
                  <button className="btn btn-primary ms-auto">
                    View All Candidates
                  </button>
                </div>

                <p className="text-muted small mt-3 mb-0">
                  We will call you in the next 4 hours (10 a.m. – 6:30 p.m.)
                </p>
              </div>
            </div>
          ))
        ) : (
          !loading && (
            <p className="text-center text-muted mt-5">
              No jobs posted yet
            </p>
          )
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <nav className="mt-4">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </button>
              </li>

              {[...Array(totalPages)].map((_, index) => {
                const pageNo = index + 1;
                return (
                  <li
                    key={pageNo}
                    className={`page-item ${
                      page === pageNo ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setPage(pageNo)}
                    >
                      {pageNo}
                    </button>
                  </li>
                );
              })}

              <li
                className={`page-item ${
                  page === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default RecruiterJobList;
