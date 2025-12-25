"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { FaTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import InfiniteScroll from "react-infinite-scroll-component";

import Loader from "@/ui/common/loader/Loader";
import {
  getRecruiterJobList,
  deleteJobPstedServices,
} from "@/services/RecruiterService";
import { showAlert, showConfirmAlert } from "@/utils/swalFire";
import { useRouter } from "next/navigation";

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
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const fetchJobs = useCallback(
    async (currentPage: number, isInitial = false) => {
      try {
        setLoading(true);

        const res = await getRecruiterJobList(currentPage, LIMIT);

        if (res?.success) {
          const newJobs: JobItem[] = res?.data?.items || [];
          const totalPages = res?.data?.totalPages || 1;

          setJobs((prev) => {
            if (isInitial) return newJobs;
            const existingIds = new Set(prev.map((j) => j.job_id));
            const uniqueNewJobs = newJobs.filter(
              (j) => !existingIds.has(j.job_id)
            );
            return [...prev, ...uniqueNewJobs];
          });
          setHasMore(currentPage < totalPages);
        }
      } catch (error) {
        console.error("Job fetch error", error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    []
  );
  useEffect(() => {
    setPage(1);
    fetchJobs(1, true);
  }, [fetchJobs]);

  const fetchMoreData = () => {
    if (!hasMore) return;

    const nextPage = page + 1;
    setPage(nextPage);
    fetchJobs(nextPage);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await showConfirmAlert({
      title: "Delete Job?",
      text: "This action cannot be undone",
      confirmText: "Yes, delete",
    });

    if (!confirmed) return;

    try {
      const res = await deleteJobPstedServices(id);

      if (res?.success && res?.code === 200) {
        showAlert("success", res.message || "Deleted successfully");
        setJobs((prev) => prev.filter((job) => job.job_id !== id));
      } else {
        showAlert("error", res?.message || "Delete failed");
      }
    } catch (error: any) {
      showAlert("error", error?.message || "Server error");
    }
  };
  const handleJobedit = (jobUpdate: any) => {
    router.push(`/recruiter/job/update`);
    localStorage.setItem("jobUpdate", JSON.stringify(jobUpdate))
  }
  return (
    <div className="jobposting">
      <div className="container">
        <div className="row">
          <div className="col-md-12">

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-0">Jobs</h4>
              <Link href="/recruiter/job">
                <button className="btn btn-primary">Post a Job</button>
              </Link>
            </div>

            {/* SCROLL CONTAINER */}
            <div
              id="jobScroll"
              style={{ height: "75vh", overflow: "auto" }}
            >
              <InfiniteScroll
                dataLength={jobs.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={
                  <div className="text-center my-3">
                    <Loader />
                  </div>
                }
                endMessage={
                  jobs.length > 0 && (
                    <p className="text-center text-muted my-4">
                      No more jobs to load
                    </p>
                  )
                }
                scrollableTarget="jobScroll"
              >
                {/* JOB LIST */}
                {jobs.map((job) => (
                  <div
                    key={`${job.job_id}-${job.created_at}`}
                    className="formsection mb-4"
                  >
                    <div className="d-flex justify-content-between">
                      <div>
                        <h5>
                          {job.job_title_name}
                          <span className="badge bg-warning text-dark ms-2">
                            {job.status}
                          </span>
                        </h5>

                        <p className="text-muted small mb-2">
                          {job.locality_name}, {job.city_name} | ₹
                          {Number(job.salary_min).toLocaleString()} - ₹
                          {Number(job.salary_max).toLocaleString()} |{" "}
                          {job.openings} opening
                        </p>
                      </div>

                      <div className="text-muted small">
                        {new Date(job.created_at).toLocaleDateString()}
                        <span
                          className="ms-2 text-danger cursor-pointer"
                          onClick={() => handleDelete(job.job_id)}
                        >
                          <FaTrashAlt />
                        </span>
                        <span
                          className="ms-2 text-warning  cursor-pointer"
                          onClick={() => handleJobedit(job)}
                        >
                          <FaEdit />
                        </span>
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

                    <div className="mt-3 text-muted small">
                      We will call you in the next 4 hours (10 a.m. – 6:30 p.m.)
                    </div>
                  </div>
                ))}

                {/* EMPTY STATE */}
                {!loading && jobs.length === 0 && (
                  <p className="text-center text-muted mt-5">
                    No jobs posted yet
                  </p>
                )}
              </InfiniteScroll>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterJobList;
