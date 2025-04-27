// src/components/StudentList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './StudentList.css';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  
  const fetchStudents = async () => {
    try {
      const res = await api.get('/');
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };
  
  const deleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.delete(`/${id}`);
        alert('Student deleted successfully!');
        fetchStudents();
      } catch (err) {
        alert('Failed to delete student.');
        console.error(err);
      }
    }
  };
  
  useEffect(() => {
    fetchStudents();
  }, []);
  
  // Get unique departments for filter dropdown
  const departments = [...new Set(students.map(s => s.department))];
  
  // Filter students based on search term and filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = searchTerm === '' || 
    (`${student.firstName} ${student.lastName}`).toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
  
      
    const matchesStatus = statusFilter === '' || 
      (statusFilter === 'active' && student.isActive) ||
      (statusFilter === 'inactive' && !student.isActive);
      
    const matchesDepartment = departmentFilter === '' || 
      student.department === departmentFilter;
      
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Function to get initials from name
  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };
  
  return (
    <div className="student-list-container">
      <div className="student-list-header">
        <h2>Student Management</h2>
        <Link to="/add" className="add-btn">Add New Student</Link>
      </div>
      
      <div className="filters-wrapper">
        <div className="search-input">
          <input 
            type="text" 
            placeholder="Search by name, email or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select 
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        
        <select 
          className="filter-select"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>
      
      {filteredStudents.length > 0 ? (
        <div className="student-table-wrapper">
          <table className="student-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>ID</th>
                <th>Department</th>
                <th>Enrollment</th>
                <th>DOB</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student._id}>
                  <td data-label="Student">
                    <div className="student-name">
                      <div className="student-avatar">
                        {getInitials(student.firstName, student.lastName)}
                      </div>
                      <div className="student-info">
                        <span className="name">{student.firstName} {student.lastName}</span>
                        <span className="email">{student.email}</span>
                      </div>
                    </div>
                  </td>
                  <td data-label="ID">{student.studentId}</td>
                  <td data-label="Department">{student.department}</td>
                  <td data-label="Enrollment">{student.enrollmentYear}</td>
                  <td data-label="DOB">{new Date(student.dob).toLocaleDateString()}</td>
                  <td data-label="Status">
                  <span className={`status-badge ${student.isActive ? 'status-active' : 'status-inactive'}`}>
                      {student.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td data-label="Actions">
                    <div className="action-btns">
                      <Link to={`/view/${student._id}`} className="action-btn view-btn">👁️</Link>
                      <Link to={`/edit/${student._id}`} className="action-btn edit-btn">✏️</Link>
                      <button 
                        onClick={() => deleteStudent(student._id)} 
                        className="action-btn delete-btn"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-results">
          <p>No students found. Try adjusting your filters or add new students.</p>
        </div>
      )}
      
      {filteredStudents.length > 0 && (
        <div className="pagination">
          <span className="page-info">
            Showing {filteredStudents.length} of {students.length} students
          </span>
          {/* Pagination controls can be added here when implementing pagination */}
        </div>
      )}
    </div>
  );
};

export default StudentList;