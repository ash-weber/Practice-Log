import React from 'react';

const Pagination = ({ page, total, limit, onPageChange }) => {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handlePrev = () => onPageChange(Math.max(1, page - 1));
  const handleNext = () => onPageChange(Math.min(totalPages, page + 1));

  if (totalPages === 1) return null;

  return (
    <div style={styles.container}>
      <button onClick={() => onPageChange(1)} disabled={page === 1} style={styles.btn}>First</button>
      <button onClick={handlePrev} disabled={page === 1} style={styles.btn}>Prev</button>
      <span style={styles.info}>Page {page} of {totalPages}</span>
      <button onClick={handleNext} disabled={page === totalPages} style={styles.btn}>Next</button>
      <button onClick={() => onPageChange(totalPages)} disabled={page === totalPages} style={styles.btn}>Last</button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '12px',
  },
  btn: {
    padding: '6px 10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    background: 'white',
    cursor: 'pointer',
  },
  info: {
    fontSize: '14px',
    color: '#333',
  }
};

export default Pagination;
