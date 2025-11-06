import React from 'react';

const SkeletonCard = ({ width = '100%', height = 16, style = {} }) => {
  const base = {
    background: 'linear-gradient(90deg, #eee 25%, #f5f5f5 37%, #eee 63%)',
    backgroundSize: '400% 100%',
    animation: 'skeleton-loading 1.2s linear infinite',
    borderRadius: 6,
    width,
    height,
    display: 'inline-block',
  };
  return (
    <>
      <div style={{ ...base, ...style }} />
      <style>{`@keyframes skeleton-loading { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }`}</style>
    </>
  );
};

export default SkeletonCard;
