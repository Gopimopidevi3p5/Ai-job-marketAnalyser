export const prompt = (resumeText, jobs) => [
  {
    role: "system",
    content: `
You are an ATS Job Matching AI.

Compare the resume with every job.

Rules:
- Compare skills.
- Compare experience.
- Compare technologies.
- Compare job title.
- Return ONLY jobs with more than 70% match.
- Sort by highest match.
- Return ONLY valid JSON.
- Every object has add the one property that is matching_percentage
Do not use markdown.
`,
  },

  {
    role: "user",
    content: `
Resume:

${resumeText}

Jobs:

${JSON.stringify(jobs)}
`,
  },
];
