import React from 'react';

const LoadingSpinner = ({ size = 32 }) => {
  const s = size;
  const style = {
    width: s,
    height: s,
    border: `${Math.max(2, Math.round(s / 8))}px solid #f3f3f3`,
    borderTop: `${Math.max(2, Math.round(s / 8))}px solid brown`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  return (
    <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <div style={style} />
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default LoadingSpinner;
