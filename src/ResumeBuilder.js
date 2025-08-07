
import React, { useState } from 'react';

const ResumeBuilder = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    skills: '',
    jobTitle: '',
    companyName: '',
    targetPosition: '',
    targetCompany: '',
    experience: [{ role: '', company: '', duration: '', description: '' }],
    education: [{ degree: '', institution: '', year: '' }]
  });
  const [outputType, setOutputType] = useState('resume');
  const [generated, setGenerated] = useState({ resume: '', coverLetter: '' });
  const [loading, setLoading] = useState(false);
  const [aiOptions, setAiOptions] = useState({
    tone: 'professional',
    length: 'standard',
    focus: 'skills'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...formData.experience];
    updatedExperience[index][field] = value;
    setFormData({ ...formData, experience: updatedExperience });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { role: '', company: '', duration: '', description: '' }]
    });
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index][field] = value;
    setFormData({ ...formData, education: updatedEducation });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { degree: '', institution: '', year: '' }]
    });
  };

  const generateContent = () => {
    setLoading(true);
    setTimeout(() => {
      if (outputType === 'resume' || outputType === 'both') {
        const generatedResume = generateResume();
        setGenerated((prev) => ({ ...prev, resume: generatedResume }));
      }
      if (outputType === 'coverLetter' || outputType === 'both') {
        const generatedCoverLetter = generateCoverLetter();
        setGenerated((prev) => ({ ...prev, coverLetter: generatedCoverLetter }));
      }
      setLoading(false);
      setStep(4);
    }, 1500);
  };

  const generateResume = () => {
    const skillsList = formData.skills
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0)
      .join(', ');
    const experienceSection = formData.experience
      .filter((exp) => exp.role && exp.company)
      .map((exp) => \`\${exp.role} | \${exp.company} | \${exp.duration}\n\${exp.description}\`)
      .join('\n\n');
    const educationSection = formData.education
      .filter((edu) => edu.degree && edu.institution)
      .map((edu) => \`\${edu.degree} - \${edu.institution} (\${edu.year})\`)
      .join('\n');

    return \`\${formData.fullName}
\${formData.email} | \${formData.phone} | \${formData.location}

PROFESSIONAL SUMMARY
\${formData.summary}

SKILLS
\${skillsList}

EXPERIENCE
\${experienceSection}

EDUCATION
\${educationSection}\`;
  };

  const generateCoverLetter = () => {
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    let salutation = formData.targetCompany ? \`\${formData.targetCompany} Hiring Team\` : 'Hiring Manager';
    let opening =
      aiOptions.tone === 'professional'
        ? \`I am writing to express my interest in the \${formData.targetPosition} position at \${formData.targetCompany}.\`
        : \`I'm excited to apply for the \${formData.targetPosition} role at \${formData.targetCompany}!\`;

    let body =
      aiOptions.focus === 'skills'
        ? \`With experience as a \${formData.jobTitle} at \${formData.companyName}, I've developed strong skills in \${formData.skills}. These skills position me well to contribute to your team and help achieve company objectives.

My professional background has prepared me to excel in this role. \${formData.summary}\`
        : \`Throughout my career at \${formData.companyName} as a \${formData.jobTitle}, I've demonstrated the ability to deliver results and overcome challenges. \${formData.summary}

I would bring to \${formData.targetCompany} my expertise in \${formData.skills}, along with my passion for the industry.\`;

    let closing =
      aiOptions.tone === 'professional'
        ? \`Thank you for considering my application. I look forward to the opportunity to discuss how my background aligns with your needs for the \${formData.targetPosition} position.\`
        : \`I'm excited about the possibility of joining \${formData.targetCompany} and would love to chat about how I can contribute to your team's success as a \${formData.targetPosition}.\`;

    return \`\${currentDate}

\${salutation},

\${opening}

\${body}

\${closing}

Sincerely,
\${formData.fullName}
\${formData.phone}
\${formData.email}\`;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Resume Builder</h1>
      <button
        onClick={generateContent}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Generate Documents
      </button>
      {step === 4 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Results</h2>
          <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">{generated.resume}</pre>
          <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded mt-4">{generated.coverLetter}</pre>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;
