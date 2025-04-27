// src/DeleteStudent.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import './DeleteStudent.css'; // Using the same styling approach
import { FiSearch, FiAlertTriangle } from 'react-icons/fi';
import { toast } from 'react-toastify';

function DeleteStudent() {
  const [searchName, setSearchName] = useState('');
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
        setStudentToDelete(res.data[0]); // take the first match
      } else {
        toast.error('No student found with that name');
        setStudentToDelete(null);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to search for student');
      setStudentToDelete(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDelete = async () => {
    if (!studentToDelete) return;

    try {
      setIsDeleting(true);
      await api.delete(`/students/${studentToDelete._id}`);
      toast.success('Student deleted successfully');
      navigate('/students');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete student');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setStudentToDelete(null);
    setSearchName('');
  };

  return (
    <div className="delete-container">
      <h2>Delete Student</h2>
      
      {!studentToDelete ? (
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
      ) : (
        <div className="confirmation-container">
          <div className="warning-icon">
            <FiAlertTriangle size={48} />
          </div>
          <div className="student-details">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete the following student?</p>
            <div className="details-box">
              <p><strong>Name:</strong> {studentToDelete.firstName} {studentToDelete.lastName}</p>
              <p><strong>Email:</strong> {studentToDelete.email}</p>
              <p><strong>Status:</strong> {studentToDelete.status}</p>
            </div>
            <p className="warning-text">This action cannot be undone.</p>
          </div>
          <div className="btn-container">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={cancelDelete}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Student'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteStudent;