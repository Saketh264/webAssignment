import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        🎓 StudentSys
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/students">Students</Link></li>
        <li><Link to="/add">Add Student</Link></li>
        {/* <li><Link to="/edit-search">Search & Edit</Link></li>
        <li><Link to="/delete">Delete Student</Link></li> */}
      </ul>
    </nav>
  );
};

export default Navbar;
