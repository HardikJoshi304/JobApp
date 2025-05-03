import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { motion } from 'framer-motion'; // animation

const API_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

function App() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    company: '',
    role: '',
    status: 'Applied',
    dateOfApplication: '',
    link: ''
  });
  const [filter, setFilter] = useState('');

  const fetchJobs = async () => {
    try {
      const res = await axios.get(API_URL + (filter ? `?status=${filter}` : ''));
      if (Array.isArray(res.data)) {
        setJobs(res.data);
      } else {
        console.error('API did not return an array:', res.data);
        setJobs([]);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, form);
      setForm({ company: '', role: '', status: 'Applied', dateOfApplication: '', link: '' });
      fetchJobs();
    } catch (error) {
      console.error('Error submitting job:', error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/${id}`, { status });
      fetchJobs();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteJob = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Student Job Tracker</h1>

      <form onSubmit={handleSubmit} className="form-container">
        <input
          className="input"
          placeholder="Company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
        <input
          className="input"
          placeholder="Role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        />
        <input
          className="input"
          type="date"
          value={form.dateOfApplication}
          onChange={(e) => setForm({ ...form, dateOfApplication: e.target.value })}
        />
        <input
          className="input"
          placeholder="Link"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
        />
        <select
          className="input"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
        <button className="submit-button" type="submit">
          Add Job
        </button>
      </form>

      <div className="filter-container">
        <label className="filter-label">Filter by Status:</label>
        <select
          className="input"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <ul className="job-list">
        {Array.isArray(jobs) ? (
          jobs.map((job) => (
            <motion.li
              key={job._id}
              className="job-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="job-header">
                {job.company} - {job.role}
              </div>
              <div className="job-info">
                Status: {job.status} |{' '}
                {new Date(job.dateOfApplication).toLocaleDateString()}
              </div>
              <a
                className="job-link"
                href={job.link}
                target="_blank"
                rel="noreferrer"
              >
                View Link
              </a>
              <div className="job-actions">
                <select
                  className="input"
                  value={job.status}
                  onChange={(e) => updateStatus(job._id, e.target.value)}
                >
                  <option>Applied</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>
                <button
                  className="delete-button"
                  onClick={() => deleteJob(job._id)}
                >
                  Delete
                </button>
              </div>
            </motion.li>
          ))
        ) : (
          <p className="error-text">
            Unable to load jobs — check the API response format.
          </p>
        )}
      </ul>
    </div>
  );
}

export default App;
