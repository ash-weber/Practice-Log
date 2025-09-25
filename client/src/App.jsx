import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SkillLogForm from './components/SkillLogForm';
import ViewEntries from './components/ViewEntries';
import LoginPage from './components/Home';
import Home from './components/Home';
import Layout from './components/Layout';

const App = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [allEntries, setAllEntries] = useState([]);


  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <Router>
      <Routes>
        
        <Route path="/login" element={<LoginPage setUser={setUser} />} />

       
        {user && (
          <Route element={<Layout user={user} setUser={setUser} />}>
            <Route path="/" element={<Home user={user} setUser={setUser} />} />
            <Route path="/add-new" element={<SkillLogForm user={user} setAllEntries={setAllEntries} />} />
           <Route
              path="/view-entries"
              element={<ViewEntries userEmail={user.email} />}
            />
          </Route>
        )}

     
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
