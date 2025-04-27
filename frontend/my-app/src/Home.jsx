import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-glass-card">
        <h1>🎓 StudentSys</h1>
        <p>Manage student records with ease. Add, edit, and keep track of all your student info in one stylish dashboard.</p>
        <div className="home-btns">
          <Link to="/students" className="btn primary">View Students</Link>
          <Link to="/add" className="btn secondary">Add New</Link>
          {/* <Link to="/edit" className="btn warning">Edit Student</Link>
          <Link to="/delete" className="btn danger">Delete Student</Link> */}
        </div>
      </div>
    </div>
  );
};

export default Home;


