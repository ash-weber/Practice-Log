import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const skillOptions = [
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'AWS', label: 'AWS' },
  { value: 'API Integration', label: 'API Integration' },
  { value: 'ASP.NET', label: 'ASP.NET' },
  { value: 'Adobe Illustrator', label: 'Adobe Illustrator' },
  { value: 'Adobe Photoshop', label: 'Adobe Photoshop' },
  { value: 'Adobe InDesign', label: 'Adobe InDesign' },
  { value: 'Angular', label: 'Angular' },
  { value: 'BI Modeling', label: 'BI Modeling' },
  { value: 'Backend Dev', label: 'Backend Dev' },
  { value: 'Big Data', label: 'Big Data' },
  { value: 'Brand Development', label: 'Brand Development' },
  { value: 'Budgeting', label: 'Budgeting' },
  { value: 'Business Planning and Management', label: 'Business Planning and Management' },
  { value: 'C Programming', label: 'C Programming' },
  { value: 'C#', label: 'C#' },
  { value: 'C++', label: 'C++' },
  { value: 'CRM', label: 'CRM' },
  { value: 'CSS', label: 'CSS' },
  { value: 'Cloud Computing', label: 'Cloud Computing' },
  { value: 'Cloud Based Tools', label: 'Cloud Based Tools' },
  { value: 'Communication', label: 'Communication' },
  { value: 'Content Creation', label: 'Content Creation' },
  { value: 'Cyber Security', label: 'Cyber Security' },
  { value: 'Data Analytics/Science', label: 'Data Analytics/Science' },
  { value: 'DBM', label: 'DBM' },
  { value: 'Decision Making', label: 'Decision Making' },
  { value: 'ERP Dev', label: 'ERP Dev' },
  { value: 'ETL', label: 'ETL' },
  { value: 'Editing', label: 'Editing' },
  { value: 'Email and WhatsApp Automation', label: 'Email and WhatsApp Automation' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Employee Training', label: 'Employee Training' },
  { value: 'Entity Framework', label: 'Entity Framework' },
  { value: 'Event Management', label: 'Event Management' },
  { value: 'ExpressJS', label: 'ExpressJS' },
  { value: 'React', label: 'React' },
  { value: 'NodeJS', label: 'NodeJS' },
  { value: 'MS Excel', label: 'MS Excel'},
  { value: 'Forecasting', label: 'Forecasting' },
  { value: 'Frontend Dev', label: 'Frontend Dev' },
  { value: 'Graphic Design', label: 'Graphic Design' },
  { value: 'HR Operations', label: 'HR Operations' },
  { value: 'HTML', label: 'HTML' },
  { value: 'JS', label: 'JS' },
  { value: 'KPI Reporting', label: 'KPI Reporting' },
  { value: 'MS Office 365', label: 'MS Office 365' },
  { value: 'MySQL', label: 'MySQL' },
  { value: 'Leadership', label: 'Leadership' },
  { value: 'Listening', label: 'Listening' },
  { value: 'Networking', label: 'Networking' },
  { value: 'Online Advertising', label: 'Online Advertising' },
  { value: 'PHP', label: 'PHP' },
  { value: 'Photography', label: 'Photography' },
  { value: 'PowerBI', label: 'PowerBI' },
  { value: 'Prisma', label: 'Prisma' },
  { value: 'Tableau', label: 'Tableau' },
  { value: 'Python', label: 'Python' },
  { value: 'SEO Plan', label: 'SEO Plan' },
  { value: 'RESTful API', label: 'RESTful API' },
  { value: 'Salesforce', label: 'Salesforce' },
  { value: 'Software Dev', label: 'Software Dev' },
  { value: 'Social Media Marketing', label: 'Social Media Marketing' },
  { value: 'Supply Chain Management', label: 'Supply Chain Management' },
  { value: 'Tally', label: 'Tally' },
  { value: 'UI/UX', label: 'UI/UX' },
  { value: 'Time Management', label: 'Time Management' },
  { value: 'Video Editing', label: 'Video Editing' },
  { value: 'XMind', label: 'XMind' },
  { value: 'Web Dev', label: 'Web Dev' },
  { value: 'jQuery', label: 'jQuery' },
  { value: 'AJAX', label: 'AJAX' },
  { value: 'JWT', label: 'JWT' },
  { value: 'React Redux', label: 'React Redux' },
  { value: 'GitHub', label: 'GitHub' },
  { value: 'MongoDB', label: 'MongoDB' },
  { value: 'Postman', label: 'Postman' },
  { value: 'ThunderClient', label: 'ThunderClient' },
  { value: 'Firebase', label: 'Firebase' },
  { value: 'Supabase', label: 'Supabase' },
  { value: 'Java', label: 'Java' },
  { value: 'PostgreSql', label: 'PostgreSql' },
  { value: 'Typescript', label: 'Typescript' },
  { value: 'NextJS', label: 'NextJS' },
  { value: 'TailwindCSS', label: 'TailwindCSS' },
];


const practiceTypes = [
  "Attend Training",
  "Hands-on Practice",
  "Work on a Project",
  "Take Test(s) or Certification",
  "On Job",
  "Conducted Workshop",
  "Teach a Class",
  "Other",
];


const resultOptions = [
  { value: 'Improved Productivity', label: 'Improved Productivity' },
  { value: 'Moved from Beginner to Advanced skill Level', label: 'Moved from Beginner to Advanced skill Level' },
  { value: 'Moved to Expert Level', label: 'Moved to Expert Level' },
  { value: 'Gained Conceptual Clarity', label: 'Gained Conceptual Clarity' },
  { value: 'Increased Confidence', label: 'Increased Confidence' },
  { value: 'Achieved Certification',  label: 'Achieved Certification' },
  { value: 'Received Appreciation', label: 'Received Appreciation' },
  { value: 'Identified New Application Areas', label: 'Identified New Application Areas' },
  { value: 'Solved a Complex Problem', label: 'Solved a Complex Problem' },
  { value: 'Demonstrated Skill in Project', label: 'Demonstrated Skill in Project' },
  { value: 'Shared Knowledge With Team', label: 'Shared Knowledge With Team' },
  { value: 'Tried New Approach or Tool', label: 'Tried New Approach or Tool' },
  { value: 'Better Time Management', label: 'Better Time Management' },
  { value: 'Created a Report / Visual / Output', label: 'Created a Report / Visual / Output' },
  { value: 'Other', label: 'Other' },
];

const SkillLogForm = ({ user, setAllEntries }) => {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [hoursSpent, setHoursSpent] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [practiceType, setPracticeType] = useState([]);
  const [otherPractice, setOtherPractice] = useState('');
  const [practiceTypeError, setPracticeTypeError] = useState('');
  const [verifier, setVerifier] = useState('');
  const [notes, setNotes] = useState('');
  const [resultsAchieved, setResultsAchieved] = useState([]);
  const [otherResult, setOtherResult] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); 


  useEffect(() => {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = `
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translate(-50%, -60%); }
      10% { opacity: 1; transform: translate(-50%, -50%); }
      90% { opacity: 1; }
      100% { opacity: 0; transform: translate(-50%, -40%); }
    }

    @media (max-width: 768px) {
      .skill-form-container {
        padding: 12px !important;
      }

      .skill-form-date-row {
        flex-direction: column !important;
        gap: 12px !important;
      }

      .skill-form-label {
        font-size: 14px !important;
      }

      .skill-form-input,
      .skill-form-textarea {
        font-size: 14px !important;
        padding: 8px !important;
      }

      .skill-form-submit {
        width: 100% !important;
      }
    }

    @media (max-width: 480px) {
      .skill-form-heading {
        font-size: 20px !important;
      }

      .skill-form-subtext {
        font-size: 14px !important;
      }
    }
  `;
  document.head.appendChild(styleTag);
}, []);

  const needsVerifier = practiceType.some(type =>
    ["Attend Training", "Work on a Project", "On Job"].includes(type)
  );

  const handleCheckboxChange = (type) => {
    setPracticeType(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (practiceType.length === 0) {
    setPracticeTypeError("Please select at least one type of practice..");
    return;
    } else {
    setPracticeTypeError('');
    }


    const updatedPracticeTypes = practiceType.map(type =>
      type === "Other" && otherPractice ? otherPractice : type
    );

    const updatedResults = resultsAchieved.map(r =>
      r.value === "Other" && otherResult ? otherResult : r.value
    );

    const newEntry = {
      userEmail: user?.email || '',
      skills: selectedSkills.map(s => s.value),
      hoursSpent,
      startDate,
      endDate,
      practiceType: updatedPracticeTypes,
      verifier: needsVerifier ? verifier : null,
      notes,
      resultsAchieved: updatedResults,
    };

    console.log('Submitting entry:', newEntry);

    try {
      const response = await fetch('http://localhost:8000/api/submit-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
      });

      const text = await response.text();
      console.log('Raw response text:', text);

      let data;
      try {
        data = JSON.parse(text);
        console.log('Parsed JSON:', data);
      } catch (err) {
        console.error('Failed to parse JSON:', err);
        alert("Server did not return valid JSON.");
        return;
      }

      if (!response.ok) {
        console.error('Server error:', data.error || response.statusText);
        alert(data.error || 'Failed to create entry');
        return;
      }

      setToastMessage('✅ Entry created successfully!');
      setShowToast(true);
      setTimeout(() => {
      setShowToast(false);
      }, 4000);

      setAllEntries(prev => [...prev, data.entry]);

      
      setSelectedSkills([]);
      setHoursSpent('');
      setStartDate('');
      setEndDate('');
      setPracticeType([]);
      setOtherPractice('');
      setVerifier('');
      setNotes('');
      setResultsAchieved([]);
      setOtherResult('');
    } catch (error) {
      console.error('Network error:', error);
      setToastMessage(`❌ ${error.message || 'Network error occurred!'}`);
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  };


  return (
    <div style={{ ...styles.container }} className="skill-form-container">
      <br/>
      <h2 style={styles.heading}>Skill Enhancement Credits</h2>
      <p style={styles.subtext}>Use this form to enter practice log.</p>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}><b>Skill(s)</b></label>
          <Select
            isMulti
            options={skillOptions}
            value={selectedSkills}
            onChange={setSelectedSkills}
            placeholder="Select your skills..."
            required style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}><b>Hours Spent in Practice/Applying Skill</b></label>
          <input
            type="number"
            value={hoursSpent}
            onChange={(e) => setHoursSpent(e.target.value)}
            placeholder="Enter hours spent for this skill practice..."
            required
            style={styles.input}
          />
        </div>

      
        <div style={styles.formGroup}>
          <label style={styles.label}><b>Date(s) or Date Range</b></label>
          <div style={styles.dateRow}>
            <div style={styles.dateColumn}>
              <label>Start Date:</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required style={styles.input} />
            </div>
            <div style={styles.dateColumn}>
              <label>End Date:</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required style={styles.input} />
            </div>
          </div>
        </div>

      
        <div style={styles.formGroup}>
        <label style={styles.label}><b>Types of Practice</b></label>
        {practiceTypes.map((type) => (
          <label key={type} style={styles.checkboxLabel}>
          <input
        type="checkbox"
        checked={practiceType.includes(type)}
        onChange={() => handleCheckboxChange(type)}
      />
      {` ${type}`}
    </label>
        ))}
      {practiceType.includes("Other") && (
    <input
      type="text"
      value={otherPractice}
      onChange={(e) => setOtherPractice(e.target.value)}
      placeholder="Please specify"
      required
      style={{ ...styles.input, marginTop: '10px' }}
    />
  )}
  {practiceTypeError && (
    <p style={{ color: 'red', marginTop: '10px' }}>{practiceTypeError}</p>
  )}
    </div>



        {needsVerifier && (
        <div style={styles.formGroup}>
        <label style={styles.label}><b>Verifier Needed</b></label>
        <input
        type="text"
        value={verifier}
        onChange={(e) => setVerifier(e.target.value)}
        placeholder="Enter your Verifier name:"
        required
        style={styles.input}
        />
       <p style={styles.verifierNote}>
        Verifier is required if you select "Attend Training", "Work on a Project", or "On Job".
      </p>
      </div>
        )}

     
  <div style={styles.formGroup}>
  <label style={styles.label}><b>Result Achieved</b></label>
  <Select
    isMulti
    options={resultOptions}
    value={resultsAchieved}
    onChange={setResultsAchieved}
    placeholder="Users can select multiple result(s) achieved..."
  />
  {resultsAchieved.some(result => result.value === "Other") && (
    <input
      type="text"
      value={otherResult}
      onChange={(e) => setOtherResult(e.target.value)}
      placeholder="Please specify other outcomes....."
      required
      style={{ ...styles.input, marginTop: '10px' }}
    />
  )}
</div>

       
  <div style={styles.formGroup}>
  <label style={styles.label}><b>Notes about this practice log</b></label>
  <textarea
    value={notes}
    onChange={(e) => setNotes(e.target.value)}
    rows={4}
    placeholder="Your feedback about this practice session..."
    style={styles.textarea}
  />
</div>


        <button type="submit" style={styles.submitButton}>Submit Entry</button>
      </form>
      {showToast && (
      <div style={{ ...styles.toast, ...(toastType === 'error' ? styles.toastError : styles.toastSuccess) }}>
      {toastMessage}
      </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    maxWidth: '720px',
    width: '100%',
    padding: '16px',
    margin: '0 auto',
    color: 'black',
    backgroundColor: 'white',
  },
  heading: {
    fontSize: '26px',
    fontWeight: '600',
    marginBottom: '12px',
    textAlign: 'center',
    color: 'brown',
  },
  subtext: {
    fontSize: '17px',
    marginBottom: '24px',
    color: '#000',
    textAlign: 'center',
  },
  form: {
    background: 'linear-gradient(135deg, #e0f2ff, #d2ddf3ff, #cfedf7ff)',
    padding: '28px',
    borderRadius: '10px',
  },
  formGroup: {
    marginTop: '16px',
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    marginBottom: '10px',
    fontSize: '16px',
    fontWeight: '500',
    color: '#000',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  checkboxLabel: {
    display: 'block',
    marginTop: '8px',
    marginBottom: '8px', 
    fontSize: '15px',
    fontWeight: '400',
    color: '#000',
  },
  verifierNote: {
    fontSize: '13px',
    color: '#000',
    marginTop: '4px',
    marginBottom: '6px',
    fontStyle: 'italic',
  },
  submitButton: {
    backgroundColor: 'brown',
    color: '#fff',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    display: 'block',
    margin: '20px auto 0 auto',
  },
  dateRow: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  dateColumn: {
    flex: 1,
  },
toast: {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: '16px 24px',
  borderRadius: '10px',
  zIndex: 9999,
  fontSize: '16px',
  textAlign: 'center',
  animation: 'fadeInOut 4s ease-in-out',
  maxWidth: '90vw',
  wordWrap: 'break-word',
},

toastSuccess: {
  backgroundColor: '#4CAF50', 
  color: '#fff',
},

toastError: {
  backgroundColor: '#f44336', 
  color: '#fff',
},

};


export default SkillLogForm;
