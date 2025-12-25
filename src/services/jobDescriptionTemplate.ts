interface SelectOption {
  value: number;
  label: string;
}

interface FormValues {
  jobTitle: SelectOption | null;
  city: SelectOption | null;
  locality: SelectOption | null;
  minExperience: string;
  maxExperience: string;
  onlyFresher: boolean;
  salaryMin: string;
  salaryMax: string;
  skills: SelectOption[];
  benefits: SelectOption[];
  shift: string;
  workingDays: string;
  workLocation: string;
}

export function generateJobDescription(data: any): string {
  const jobTitle = data?.jobTitle?.label ?? "this role";
  const city = data?.city?.label ?? "your city";
  const locality = data?.locality?.label ?? "the specified area";

  const workLocation = data?.workLocation ?? "Work from office";
  const workingDays = data?.workingDays ?? "As per company policy";
  const shift = data?.shift ?? "Day";

  const salaryMin = data?.salaryMin
    ? `₹${data.salaryMin}`
    : "As per company policy";

  const salaryMax = data?.salaryMax
    ? ` – ₹${data.salaryMax}`
    : "";

  const experienceText = data?.onlyFresher
    ? "Freshers can also apply."
    : `${data?.minExperience || "0"} to ${data?.maxExperience || "0"} years of experience required.`;

  const skillsText =
    data?.skills?.length > 0
      ? data.skills.map((s: any) => `<li>${s.label}</li>`).join("")
      : `<li>Relevant job-related skills</li>`;

  const benefitsText =
    data?.benefits?.length > 0
      ? data.benefits.map((b: any) => `<li>${b.label}</li>`).join("")
      : `<li>As per company policy</li>`;

  return `
<p>
We are looking for a <strong>${jobTitle}</strong> to join our team at
<strong>${locality}, ${city}</strong>.
</p>

<p><strong>Key Responsibilities:</strong></p>
<ul>
  <li>Perform daily job-related tasks efficiently</li>
  <li>Ensure quality and timely completion of work</li>
  <li>Follow company guidelines and safety standards</li>
</ul>

<p><strong>Job Requirements:</strong></p>
<ul>
  <li>${experienceText}</li>
  ${skillsText}
</ul>

<p><strong>Job Details:</strong></p>
<ul>
  <li><strong>Work Location:</strong> ${workLocation}</li>
  <li><strong>Working Days:</strong> ${workingDays}</li>
  <li><strong>Shift:</strong> ${shift}</li>
  <li><strong>Salary:</strong> ${salaryMin}${salaryMax} per month</li>
</ul>

<p><strong>Benefits:</strong></p>
<ul>
  ${benefitsText}
</ul>

<p>
Interested candidates can apply now. Shortlisted candidates will be contacted
for the interview process.
</p>
`;
}
