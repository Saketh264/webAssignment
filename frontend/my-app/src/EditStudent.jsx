// src/editStudent.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import './EditStudent.css'; // Using the new CSS file we created
import { FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';

function EditStudent() {
  const [searchName, setSearchName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchName.trim()) {
      toast.error('Please enter a name to search');
      return;
    }

    try {
      setIsSearching(true);
      const res = await api.get(`/search?name=${searchName}`);
      if (res.data.length > 0) {
        const student = res.data[0]; // take the first match
        navigate(`/edit/${student._id}`);
      } else {
        toast.error('No student found with that name');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to search for student');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="edit-container">
      <h2>Find Student to Edit</h2>
      <form onSubmit={handleSearch}>
        <div className="form-group">
          <label htmlFor="searchName">Student Name</label>
          <input
            id="searchName"
            type="text"
            placeholder="Enter student's first or last name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <div className="btn-container">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/students')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="search-button"
            disabled={isSearching}
          >
            {isSearching ? 'Searching...' : (
              <>
                <FiSearch /> Search
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditStudent;