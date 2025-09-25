import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import HomeImg from '../assets/logo.png'; 

const Home = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    setUser({ name: decoded.name, email: decoded.email });
    navigate('/add-new');
  };

  return (
    <div style={styles.container}>
      <img src={HomeImg} alt="Skill Enhancement" style={styles.image} />

      <h1 style={styles.title}>Welcome to Skill Enhancement Credits Log</h1>
      <p style={styles.desc}>
        This platform allows you to track and log your professional skill enhancement activities.
        Earn credits for training, projects, workshops, certifications, and more.
      </p>
      <hr/>
      <br/>
      <div style={styles.loginBox}>
        {/* <h3>Sign in with Google</h3> */}
        <p style={styles.note}>
          Please use the same Google account used for <strong>CareerSheets</strong> to link this data to your skills/profile.
        </p>

        <div style={styles.googleWrapper}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log('Google Login Failed')}
          />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '95px',
    backgroundColor: 'whitesmoke',
    borderRadius: '12px',
    textAlign: 'center',
    maxWidth: '700px',
    margin: '0 auto',
    fontFamily: 'Segoe UI, sans-serif',
  },
  title: {
    fontSize: '28px',
    color: 'brown',
    fontWeight: '600',
    marginBottom: '10px',
  },
  desc: {
    fontSize: '16px',
    color: '#444',
    marginBottom: '30px',
  },
  image: {
    width: '175px',
    cursor: 'pointer',
    marginBottom: '30px',
    borderRadius: '8px',
  },
  loginBox: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '10px',
  },
  note: {
    fontSize: '15px',
    color: 'black',
    marginBottom: '20px',
  },
  googleWrapper: {
    width: '94%',
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '14px',
    padding: '10px',
  },
};

export default Home;
