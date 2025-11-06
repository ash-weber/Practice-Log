import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.png';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [hoveredLink, setHoveredLink] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    setUser(null);
    try {
      localStorage.removeItem('token');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Could not remove token from localStorage', e);
    }
    navigate('/login');
  };

  if (!user) return null;

  const getLinkStyle = (linkName) => ({
    textDecoration: 'none',
    color: hoveredLink === linkName ? 'brown' : 'black',
    fontWeight: '500',
    fontSize: '18px',
    padding: '8px 12px',
    borderRadius: '6px',
    transition: 'color 0.2s',
    cursor: 'pointer',
  });

  return (
    <>
      <div style={styles.navbar}>
        <div style={styles.container}>
          <div style={styles.left}>
            <img src={Logo} alt="Logo" style={styles.logo} />
            <span
            style={styles.brand}
            onClick={() => navigate('/add-new')}
            >
            <strong>Skill Enhancement Credits</strong>
          </span>
          </div>

       
          {!isMobile && (
            <div style={styles.desktopRight}>
              <a
                href="/add-new"
                style={getLinkStyle('add')}
                onMouseEnter={() => setHoveredLink('add')}
                onMouseLeave={() => setHoveredLink(null)}
              >
               <b>Add New Entry</b> 
              </a>
              <a
                href="/view-entries"
                style={getLinkStyle('view')}
                onMouseEnter={() => setHoveredLink('view')}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <b>View My Entries</b>
              </a>
              <a
                href="/"
                onClick={handleLogout}
                style={getLinkStyle('logout')}
                onMouseEnter={() => setHoveredLink('logout')}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <b>Logout</b>
              </a>
            </div>
          )}

       
          {isMobile && (
            <div
              style={styles.mobileIconContainer}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <FaTimes size={28} color="brown" />
              ) : (
                <FaBars size={28} color="black" />
              )}
            </div>
          )}
        </div>
      </div>

   
      <div
        style={{
          ...styles.sidebarOverlay,
          display: sidebarOpen ? 'block' : 'none',
        }}
        onClick={() => setSidebarOpen(false)}
      >
        <div
          style={{
            ...styles.sidebar,
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(100%)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={styles.sidebarHeader}>
            <span style={styles.sidebarTitle}>Menu</span>
            <FaTimes
              size={24}
              style={styles.sidebarClose}
              onClick={() => setSidebarOpen(false)}
            />
          </div>
          <a href="/add-new" style={styles.sidebarLink} onClick={() => setSidebarOpen(false)}>
            Add New Entry
          </a>
          <a href="/view-entries" style={styles.sidebarLink} onClick={() => setSidebarOpen(false)}>
            View My Entries
          </a>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleLogout(e);
              setSidebarOpen(false);
            }}
            style={styles.sidebarLink}
          >
            Logout
          </a>
        </div>
      </div>
    </>
  );
};

const styles = {
  navbar: {
    backgroundColor: 'white',
    borderBottom: '1px solid #fff0f0',
    padding: '10px 0',
    position: 'fixed',
    width: '100%',
    top: 0,
    zIndex: 100,
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 24px',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logo: {
    width: '48px',
    height: '48px',
    objectFit: 'contain',
    cursor: 'pointer',
  },
  brand: {
    fontSize: '21px',
    fontWeight: '600',
    color: 'brown',
    cursor: 'pointer',
  },
  desktopRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  mobileIconContainer: {
    cursor: 'pointer',
  },

  sidebarOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 200,
    transition: 'opacity 0.3s ease',
  },
  sidebar: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '250px',
    height: '100vh',
    backgroundColor: '#fff',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    zIndex: 300,
    transition: 'transform 0.3s ease',
    transform: 'translateX(100%)', 
  },
  sidebarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  sidebarTitle: {
    fontSize: '22px',
    fontWeight: '600',
    color: 'brown',
  },
  sidebarClose: {
    cursor: 'pointer',
  },
  sidebarLink: {
    fontSize: '16px',
    color: 'black',
    textDecoration: 'none',
    padding: '10px 0',
    cursor: 'pointer',
  },
};

export default Header;
