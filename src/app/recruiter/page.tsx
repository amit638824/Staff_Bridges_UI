import React from "react";
import Layout from "@/pages/common/layout/Layout";

const Page = () => {
  return (
    <Layout>
      <div className="bg-primary text-white p-4 rounded mb-4">
        <h4>SEE WHAT'S NEW ON STAFF BRIDGES!</h4>
        <p>A platform you know and love, now faster and smarter</p>
      </div>

      <div className="bg-white shadow-sm rounded p-4">
        <h5 className="mb-3">Verification Steps</h5>
        <ul className="list-group">
          <li className="list-group-item d-flex justify-content-between">
            <span>Create an account</span>
            <span className="text-success fw-bold">Completed</span>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <span>Post your first job</span>
            <span className="text-warning fw-bold">Under Review</span>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <span>Email Verification</span>
            <span className="text-success fw-bold">Completed</span>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <span>Document Submission</span>
            <span className="text-muted fw-bold">Not Started</span>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <span>Verification</span>
            <span className="text-muted fw-bold">Pending</span>
          </li>
        </ul>
      </div>
    </Layout>
  );
};

export default Page;
