import React, { useState, useEffect } from 'react';
import entryService from '../services/entryService';
import Pagination from './Pagination';
import LoadingSpinner from './LoadingSpinner';
import SkeletonCard from './SkeletonCard';

const ViewEntries = () => {
  const [entries, setEntries] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [othersAnalytics, setOthersAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = { page, limit };
        if (fromDate) params.fromDate = fromDate;
        if (toDate) params.toDate = toDate;

        const [entriesRes, analyticsRes, othersRes] = await Promise.all([
          entryService.getMyEntries(params),
          entryService.getEntryAnalytics({ fromDate: params.fromDate, toDate: params.toDate }),
          entryService.getOthersAnalytics({ fromDate: params.fromDate, toDate: params.toDate }),
        ]);

        setEntries(entriesRes.entries || []);
        setTotal(entriesRes.total || 0);
        setAnalytics(analyticsRes.analytics || null);
        setOthersAnalytics(othersRes.analytics || null);
      } catch (err) {
        const message = err?.response?.data?.error || err?.message || 'Error fetching entries';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, limit, fromDate, toDate]);


  const myEntries = entries;
  const selfSkillHours = analytics?.skillHours || {};
  const totalSelfTime = analytics?.totalHours || 0;
  const userEntryCount = analytics?.totalEntries || 0;
  const avgSelfTime = analytics ? analytics.avgHoursPerEntry : 0;
  const otherSkillHours = othersAnalytics?.skillHours || {};
  const otherSkillEntryCounts = othersAnalytics?.skillEntryCounts || {};
  const othersEntryCount = othersAnalytics?.totalEntries || 0;
  const totalOtherTime = othersAnalytics?.totalHours || 0;
  const avgOtherTime = othersAnalytics && othersAnalytics.totalEntries > 0 ? (othersAnalytics.totalHours / othersAnalytics.totalEntries) : 0;

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

    const formatTime = (hoursValue) => {
      const num = Number(hoursValue) || 0;
      const totalMinutes = Math.round(num * 60);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      if (hours > 0 && minutes > 0) {
        return `${hours}h ${minutes}m`;
      }
      if (hours > 0) return `${hours}h`;
      if (minutes > 0) return `${minutes} mins`;
      return `0m`;
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const allSkills = Object.keys(selfSkillHours || {});

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <h2 style={styles.title}>My Practice Entries</h2>
        <div style={styles.filtersRow}>
          <div style={styles.datePickers}>
          <div style={styles.dateColumn}>
            <label style={{fontSize: '14px'}}>From:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
              disabled={loading}
              style={styles.input}
            />
          </div>
          <div style={styles.dateColumn}>
            <label style={{fontSize: '14px'}}>To:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => { setToDate(e.target.value); setPage(1); }}
              disabled={loading}
              style={styles.input}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{fontSize: '14px'}}>Limit:</label>
            <select value={limit} onChange={(e) => { setLimit(parseInt(e.target.value, 10)); setPage(1); }} style={styles.input} disabled={loading}>
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>
          </div>
        </div>
      </div>

      <div style={styles.sectionWrapper}>
        <div style={styles.summaryContainer}>
          <h3 style={styles.sectionTitle}>Summary</h3>
          <div style={styles.statsRow}>
            <div style={{ ...styles.statsCard, backgroundColor: '#fdaeae9c' }}>
              <h4 style={styles.cardTitle}>Entries Submitted by You</h4>
              {loading ? (
                <div>
                  <SkeletonCard width={120} height={36} />
                  <div style={{ height: 8 }} />
                  <SkeletonCard width={160} height={14} />
                </div>
              ) : (
                <>
                  <p style={{ ...styles.countText, color: 'brown' }}>{userEntryCount}</p>
                  <p><strong style={styles.label}>Total Time:</strong> {formatTime(totalSelfTime)}</p>
                  <p><strong style={styles.label}>Avg Time:</strong> {formatTime(avgSelfTime)}</p>
                </>
              )}
            </div>
            <div style={{ ...styles.statsCard, backgroundColor: '#add8e6' }}>
              <h4 style={styles.cardTitle}>Entries Submitted by Others</h4>
              {loading ? (
                <div>
                  <SkeletonCard width={120} height={36} />
                  <div style={{ height: 8 }} />
                  <SkeletonCard width={160} height={14} />
                </div>
              ) : (
                <>
                  <p style={{ ...styles.countText, color: 'blue' }}>{othersEntryCount}</p>
                  <p><strong style={styles.label}>Total Time:</strong> {formatTime(totalOtherTime)}</p>
                  <p><strong style={styles.label}>Avg Time:</strong> {formatTime(avgOtherTime)}</p>
                </>
              )}
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
          {loading ? (
            <div style={{ padding: 24, textAlign: 'center' }}>
              <LoadingSpinner size={40} />
            </div>
          ) : myEntries.length === 0 ? (
            <div style={styles.noEntriesCard}>No entries found</div>
          ) : (
            <div>
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
              <Pagination page={page} total={total} limit={limit} onPageChange={(p) => setPage(p)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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

