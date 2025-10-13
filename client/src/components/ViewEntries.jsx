import React, { useState, useEffect, useMemo } from 'react';

const ViewEntries = ({ userEmail }) => {
  const [allEntries, setAllEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

useEffect(() => { const fetchEntries = async () => { 
    try { 
    const res = await fetch('https://practice-log.onrender.com/api/get-entries'); 
    if (!res.ok) throw new Error('Failed to fetch entries'); 
    const data = await res.json(); console.log('Fetched entries:', data); setAllEntries(data); 
    } 
    catch (err) { 
      setError(err.message || 'Error fetching entries'); 
                } finally 
    { setLoading(false); } }; fetchEntries(); }, []);


  // — All hooks must be at top level, before any returns —

   const normalizedUserEmail = useMemo(() => {
    return (userEmail || localStorage.getItem('userEmail') || '')
      .trim()
      .toLowerCase();
  }, [userEmail]);

  const filteredEntries = useMemo(() => {
    return allEntries.filter(entry => {
      const entryStartDate = new Date(entry.startDate);
      const entryEndDate = new Date(entry.endDate);

      if (fromDate && entryEndDate < new Date(fromDate)) return false;
      if (toDate && entryStartDate > new Date(toDate)) return false;

      return true;
    });
  }, [allEntries, fromDate, toDate]);

  const {
    selfSkillHours,
    otherSkillHours,
    otherSkillEntryCounts,
    userEntryCount,
    othersEntryCount,
    myEntries
  } = useMemo(() => {
    const selfSkillHours = {};
    const otherSkillHours = {};
    const otherSkillEntryCounts = {};
    const myEntries = [];

    let userEntryCount = 0;
    let othersEntryCount = 0;

    filteredEntries.forEach(entry => {
      const entryEmail = (entry.user?.email || '').trim().toLowerCase();
      const isSelf = entryEmail === normalizedUserEmail;

      const hours = parseFloat(entry.hoursSpent) || 0;
      const skillList = Array.isArray(entry.skills) ? entry.skills : [];
      const skillHours = hours / (skillList.length || 1);

      if (isSelf) {
        userEntryCount++;
        myEntries.push(entry);
        skillList.forEach(skill => {
          selfSkillHours[skill] = (selfSkillHours[skill] || 0) + skillHours;
        });
      } else {
        othersEntryCount++;
        skillList.forEach(skill => {
          otherSkillHours[skill] = (otherSkillHours[skill] || 0) + skillHours;
          otherSkillEntryCounts[skill] = (otherSkillEntryCounts[skill] || 0) + 1;
        });
      }
    });

    return {
      selfSkillHours,
      otherSkillHours,
      otherSkillEntryCounts,
      userEntryCount,
      othersEntryCount,
      myEntries,
    };
  }, [filteredEntries, normalizedUserEmail]);

  const totalSelfTime = useMemo(() =>
    Object.values(selfSkillHours).reduce((a, b) => a + b, 0),
    [selfSkillHours]
  );
  const totalOtherTime = useMemo(() =>
    Object.values(otherSkillHours).reduce((a, b) => a + b, 0),
    [otherSkillHours]
  );
  const avgSelfTime = useMemo(() =>
    userEntryCount > 0 ? totalSelfTime / userEntryCount : 0,
    [totalSelfTime, userEntryCount]
  );
  const avgOtherTime = useMemo(() =>
    othersEntryCount > 0 ? totalOtherTime / othersEntryCount : 0,
    [totalOtherTime, othersEntryCount]
  );

  // Now do conditional rendering
  if (loading) {
    return <div>Loading entries...</div>;
  }
  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  const formatTime = (hoursValue) => `${Math.round(hoursValue)}h`;
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Collect all skills from selfSkillHours for display
  const allSkills = Object.keys(selfSkillHours);

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <h2 style={styles.title}>My Practice Entries</h2>
        <div style={styles.datePickers}>
          <div style={styles.dateColumn}>
            <label>From:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.dateColumn}>
            <label>To:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={styles.input}
            />
          </div>
        </div>
      </div>

      <div style={styles.sectionWrapper}>
        <div style={styles.summaryContainer}>
          <h3 style={styles.sectionTitle}>Summary</h3>
          <div style={styles.statsRow}>
            <div style={{ ...styles.statsCard, backgroundColor: '#fdaeae9c' }}>
              <h4 style={styles.cardTitle}>Entries Submitted by You</h4>
              <p style={{ ...styles.countText, color: 'brown' }}>{userEntryCount}</p>
              <p><strong style={styles.label}>Total Time:</strong> {formatTime(totalSelfTime)}</p>
              <p><strong style={styles.label}>Avg Time:</strong> {formatTime(avgSelfTime)}</p>
            </div>
            <div style={{ ...styles.statsCard, backgroundColor: '#add8e6' }}>
              <h4 style={styles.cardTitle}>Entries Submitted by Others</h4>
              <p style={{ ...styles.countText, color: 'blue' }}>{othersEntryCount}</p>
              <p><strong style={styles.label}>Total Time:</strong> {formatTime(totalOtherTime)}</p>
              <p><strong style={styles.label}>Avg Time:</strong> {formatTime(avgOtherTime)}</p>
            </div>
          </div>
        </div>

        <div style={styles.tableBox}>
          <h3 style={styles.tableTitle}>Skill-wise Summary</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Skill</th>
                  <th style={styles.th}>Total Hours by You</th>
                  <th style={styles.th}>Avg Hours by Others</th>
                </tr>
              </thead>
              <tbody>
                {allSkills.map(skill => {
                  const selfHours = selfSkillHours[skill] || 0;
                  const otherTotal = otherSkillHours[skill] || 0;
                  const countOther = otherSkillEntryCounts[skill] || 0;
                  const avgByOthers = countOther > 0 ? (otherTotal / countOther) : 0;

                  return (
                    <tr key={skill}>
                      <td style={styles.td}>{skill}</td>
                      <td style={styles.td}>{formatTime(selfHours)}</td>
                      <td style={styles.td}>{formatTime(avgByOthers)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div style={styles.entriesContainer}>
          <h3 style={styles.sectionTitle}>My Entries</h3>
          {myEntries.length === 0 ? (
            <div style={styles.noEntriesCard}>No entries found</div>
          ) : (
            <div style={styles.entryGrid}>
              {[...myEntries]
                .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
                .map((entry, idx) => (
                  <div key={idx} style={styles.entryCard}>
                    <div style={styles.entryDate}>
                      Submitted on {formatDate(entry.createdAt || entry.startDate)}
                    </div>
                    <div style={styles.entrypracdate}>
                      <strong>Practice Date:</strong> {formatDate(entry.startDate)} to {formatDate(entry.endDate)}
                    </div>
                    <div style={styles.entrySkill}>
                      <strong>Skill:</strong> {(entry.skills || []).join(', ') || 'N/A'}
                    </div>
                    <div style={styles.entryPracticeType}>
                      <strong>Practice Type:</strong> {Array.isArray(entry.practiceType) ? entry.practiceType.join(', ') : entry.practiceType || 'N/A'}
                    </div>
                    <div style={styles.entryHours}>
                      Hours Spent: <span style={styles.hoursValue}>{formatTime(parseFloat(entry.hoursSpent) || 0)}</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// (Include your existing `styles` object here — same as before)
const styles = {
  page: {
    backgroundColor: 'white',
    minHeight: '100vh',
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '40px 24px',
    fontFamily: 'Arial, sans-serif',
    color: '#000',
    borderRadius: '12px',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'brown',
  },
  datePickers: {
    display: 'flex',
    gap: '16px',
  },
  dateColumn: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '14px',
  },
  input: {
    padding: '6px',
    borderRadius: '4px',
    border: '1px solid #000',
  },
  sectionWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  summaryContainer: {
    border: '1px solid #ccc',
    borderRadius: '12px',
    padding: '24px',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '600',
    marginBottom: '16px',
    color: 'brown',
  },
  statsRow: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  statsCard: {
    flex: '1 1 180px',
    borderRadius: '12px',
    padding: '16px',
    color: '#000',
  },
  cardTitle: {
    fontSize: '18px',
    marginBottom: '12px',
  },
  countText: {
    fontSize: '42px',
    fontWeight: 'bold',
    margin: '8px 0',
  },
  label: {
    fontWeight: 'normal',
  },
  tableBox: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    overflowX: 'auto',
  },
  tableTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '16px',
    color: 'brown',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    border: '2px solid black',
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    border: '2px solid black',
    backgroundColor: '#f9f9f9',
  },
  td: {
    padding: '12px',
    border: '2px solid black',
    color: '#000',
  },
  entriesContainer: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
  },
  noEntriesCard: {
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '12px',
    padding: '16px',
    fontStyle: 'italic',
    color: '#666',
  },
  entryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  entryCard: {
    border: '1px solid #ddd',
    borderRadius: '12px',
    padding: '16px',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  entryDate: {
    color: '#eb3232',
    fontWeight: 'bold',
  },
  entrypracdate: {
    color: 'black',
  },
  entrySkill: {
    color: 'black',
  },
  entryPracticeType: {
    color: 'black',
  },
  entryHours: {
    color: 'grey',
    fontWeight: 'normal',
  },
  hoursValue: {
    fontWeight: 'normal',
    color: 'grey',
  },
};

export default ViewEntries;

