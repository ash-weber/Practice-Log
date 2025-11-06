import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import HomeImg from '../assets/logo.png'; 
import apiClient from '../services/apiClient';

const Home = ({ setUser }) => {
  const navigate = useNavigate();

  // Lightweight JWT payload parser to avoid pulling external package at runtime
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
  const decoded = parseJwt(credentialResponse.credential) || {};
    (async () => {
      try {
        const { data } = await apiClient.post('/api/auth/google', {
          credential: credentialResponse.credential,
        });
        const { token, user } = data;
        if (token) {
          localStorage.setItem('token', token);
        }
        setUser(user || { name: decoded.name, email: decoded.email });
        navigate('/add-new');
      } catch (err) {
        console.error('Login error', err?.response || err.message);
        alert('Login failed. Please try again.');
      }
    })();
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
