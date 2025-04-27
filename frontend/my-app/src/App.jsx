import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Navbar from './Navbar';
import StudentList from './studentList';
import StudentForm from './StudentForm';
import EditStudent from './editStudent';


function App() {
  return (
    <Router>
       <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/students" element={<StudentList />} />
        <Route path="/add" element={<StudentForm isEdit={false} />} />
        <Route path="/edit/:id" element={<StudentForm isEdit={true} />} />
        <Route path="/editStudent" element={<EditStudent />} />
        <Route path="/edit-search" element={<EditStudent />} />


      </Routes>
    </Router>
  );
}

export default App;
