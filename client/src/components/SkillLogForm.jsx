import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from '../services/apiClient';
import { skillOptions, practiceTypes, resultOptions } from '../data/data';

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
  const [otherSkill, setOtherSkill] = useState(''); 
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
  const spinnerStyleTag = document.createElement('style');
  spinnerStyleTag.innerHTML = styles.spinnerKeyframes;
  document.head.appendChild(spinnerStyleTag);
}, []);


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

  const handleStartDateChange = (e) => {
  const selectedDate = e.target.value;
  const currentYear = new Date().getFullYear();

  if (selectedDate) {
    const selectedYear = new Date(selectedDate).getFullYear();
    if (selectedYear !== currentYear) {
      alert(`Please select a date within the current year: ${currentYear}`);
      setStartDate('');
      return;
    }
  }
  setStartDate(selectedDate);
};

const handleEndDateChange = (e) => {
  const selectedDate = e.target.value;
  const currentYear = new Date().getFullYear();

  if (selectedDate) {
    const selectedYear = new Date(selectedDate).getFullYear();
    if (selectedYear !== currentYear) {
      alert(`Please select a date within the current year: ${currentYear}`);
      setEndDate('');
      return;
    }
  }
  setEndDate(selectedDate);
};


  const handleCheckboxChange = (type) => {
    setPracticeType(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  setIsSubmitting(true); // Start loading

  try {
    if (practiceType.length === 0) {
      setPracticeTypeError("Please select at least one type of practice.");
      setIsSubmitting(false);
      return;
    } else {
      setPracticeTypeError('');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      alert("Start date cannot be after end date.");
      setIsSubmitting(false);
      return;
    }

    const updatedPracticeTypes = practiceType.map(type =>
      type === "Other" && otherPractice ? otherPractice : type
    );

    const updatedResults = resultsAchieved.map(r =>
      r.value === "Other" && otherResult ? otherResult : r.value
    );

    const newEntry = {
      userEmail: user?.email || '',
      skills: selectedSkills.map(s => s.value === 'Other' && otherSkill ? otherSkill : s.value),
      hoursSpent,
      startDate,
      endDate,
      practiceType: updatedPracticeTypes,
      verifierName: needsVerifier ? verifier : null,
      notes,
      resultsAchieved: updatedResults,
    };

    let data;
    try {
      const resp = await apiClient.post('/api/entries', newEntry, { timeout: 5000 });
      data = resp.data;
    } catch (err) {
      // normalize axios error
      const message = err?.response?.data?.error || err?.message || 'Failed to create entry.';
      alert(message);
      setIsSubmitting(false);
      return;
    }

    setToastMessage('✅ Entry created successfully!');
    setToastType('success');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);

    if (typeof setAllEntries === 'function') {
      try {
        setAllEntries(prev => [...prev, data.entry || data]);
      } catch (err) {
        console.warn('setAllEntries failed', err);
      }
    }

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
    setOtherSkill('');
  } catch (error) {
    setToastMessage(`❌ ${error.message || 'Network error occurred!'}`);
    setToastType('error');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  } finally {
    setIsSubmitting(false);
  }
};



  return (
    <div style={{ ...styles.container }} className="skill-form-container">
      <br/>
      <h2 style={styles.heading}>Skill Enhancement Credits</h2>
      <p style={styles.subtext}>Use this form to enter practice log.</p>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}><b>Skill(s) *</b></label>
          <Select
          isMulti
          options={skillOptions}
          value={selectedSkills}
          onChange={setSelectedSkills}
          placeholder="Select your skills..."
          required
          />

        {selectedSkills.some(skill => skill.value === 'Other') && (
        <input
        type="text"
        value={otherSkill}
        onChange={(e) => setOtherSkill(e.target.value)}
        placeholder="Please specify other skill"
        required
        style={{ ...styles.input, marginTop: '10px' }}
        />
        )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}><b>Hours Spent in Practice/Applying Skill *</b></label>
          <input
          type="number"
          value={hoursSpent}
          onChange={(e) => {
          const val = e.target.value;
          if (val === '' || (Number(val) > 0 && /^\d+$/.test(val))) {
          setHoursSpent(val);
          }
          }}
          onWheel={(e) => e.target.blur()}
          placeholder="Enter hours spent for this skill practice..."
          required
          style={styles.input}
          />
        </div>

      
        <div style={styles.formGroup}>
        <label style={styles.label}><b>Date(s) or Date Range *</b></label>
        <div style={styles.dateRow}>
          <div style={styles.dateColumn}>
            <label>Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.dateColumn}>
            <label>End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              required
              style={styles.input}
            />
          </div>
        </div>
      </div>
      
        <div style={styles.formGroup}>
        <label style={styles.label}><b>Types of Practice *</b></label>
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
        <label style={styles.label}><b>Verifier Needed *</b></label>
        <input
  type="text"
  value={verifier}
  onChange={(e) => {
    const val = e.target.value;
    // Only allow alphabets and spaces
    if (/^[a-zA-Z\s]*$/.test(val)) {
      setVerifier(val);
    }
  }}
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


       <button
  type="submit"
  style={{
    ...styles.submitButton,
    backgroundColor: isSubmitting ? 'gray' : 'brown',
    cursor: isSubmitting ? 'not-allowed' : 'pointer',
  }}
  disabled={isSubmitting}
>
  {isSubmitting ? 'Submitting...' : 'Submit Entry'}
</button>
      </form>
      {isSubmitting && (
  <div style={styles.spinner}>
    <div style={styles.spinnerCircle}></div>
  </div>
)}
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
  spinner: {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 1000,
},

spinnerCircle: {
  border: '4px solid #f3f3f3',
  borderTop: '4px solid brown',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  animation: 'spin 1s linear infinite',
},

spinnerKeyframes: `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`,
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