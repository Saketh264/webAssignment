import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import './StudentForm.css';
import { FiUser, FiMail, FiCalendar, FiBook, FiHash, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentForm = ({ isEdit }) => {
  const [student, setStudent] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    department: '',
    enrollmentYear: new Date().getFullYear(),
    isActive: true
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      api.get(`/${id}`)
        .then(res => {
          const data = res.data;
          setStudent({
            ...data,
            dob: data.dob ? data.dob.substring(0, 10) : ''
          });
          setLoading(false);
        })
        .catch(err => {
          toast.error('Failed to load student data');
          setLoading(false);
        });
    }
  }, [isEdit, id]);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const currentYear = new Date().getFullYear();

    if (!student.studentId) newErrors.studentId = 'Student ID is required';
    if (!student.firstName) newErrors.firstName = 'First name is required';
    if (!student.lastName) newErrors.lastName = 'Last name is required';
    if (!student.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(student.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!student.dob) {
      newErrors.dob = 'Date of birth is required';
    } else if (new Date(student.dob) > new Date()) {
      newErrors.dob = 'Date cannot be in the future';
    }
    if (!student.department) newErrors.department = 'Department is required';
    if (!student.enrollmentYear) {
      newErrors.enrollmentYear = 'Enrollment year is required';
    } else if (student.enrollmentYear < 2000 || student.enrollmentYear > currentYear) {
      newErrors.enrollmentYear = `Year must be between 2000 and ${currentYear}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setStudent(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/${id}`, student);
        toast.success("Student updated successfully!");
      } else {
        await api.post('/', student);
        toast.success("Student added successfully!");
      }
      navigate('/students');
    } catch (err) {
      toast.error(err.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Business Administration',
    'Mathematics',
    'Physics',
    'Chemistry'
  ];

  if (loading && isEdit) {
    return (
      <div className="student-form-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="student-form-container">
      <button className="back-button" onClick={() => navigate('/students')}>
        <FiArrowLeft /> Back to Students
      </button>
      
      <div className="student-form-header">
        <h2>{isEdit ? "Edit Student" : "Add New Student"}</h2>
        <p>{isEdit ? "Update student information" : "Fill in the details to add a new student"}</p>
      </div>
      
      <form className="student-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="studentId">
              <FiHash /> Student ID
            </label>
            <input
              id="studentId"
              name="studentId"
              type="text"
              value={student.studentId}
              onChange={handleChange}
              placeholder="Enter student ID"
              disabled={isEdit}
            />
            {errors.studentId && <span className="error">{errors.studentId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="enrollmentYear">Enrollment Year</label>
            <input
              id="enrollmentYear"
              name="enrollmentYear"
              type="number"
              min="2000"
              max={new Date().getFullYear()}
              value={student.enrollmentYear}
              onChange={handleChange}
              placeholder="Enter enrollment year"
            />
            {errors.enrollmentYear && <span className="error">{errors.enrollmentYear}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">
              <FiUser /> First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={student.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
            />
            {errors.firstName && <span className="error">{errors.firstName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">
              <FiUser /> Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={student.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
            />
            {errors.lastName && <span className="error">{errors.lastName}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">
            <FiMail /> Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={student.email}
            onChange={handleChange}
            placeholder="Enter email address"
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dob">
              <FiCalendar /> Date of Birth
            </label>
            <input
              id="dob"
              name="dob"
              type="date"
              value={student.dob}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.dob && <span className="error">{errors.dob}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="department">
              <FiBook /> Department
            </label>
            <select
              id="department"
              name="department"
              value={student.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && <span className="error">{errors.department}</span>}
          </div>
        </div>

        <div className="form-group checkbox-group">
          <input
            id="isActive"
            name="isActive"
            type="checkbox"
            checked={student.isActive}
            onChange={handleChange}
          />
          <label htmlFor="isActive" className="checkbox-label">
            Currently Active Student
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : isEdit ? 'Update Student' : 'Add Student'}
        </button>
      </form>
    </div>
  );
};

export default StudentForm;
