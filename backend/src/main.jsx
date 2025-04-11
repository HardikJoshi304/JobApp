  import { StrictMode } from 'react'
  import { createRoot } from 'react-dom/client'
  import './index.css'
  import App from './App.jsx'

  const express = require('express');
  const mongoose = require('mongoose');
  const cors = require('cors');
  require('dotenv').config();

  const app = express();
  app.use(cors());
  app.use(express.json());

  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

  const Job = require('./models/job.jsx');

  // Routes
  app.post('/api/jobs', async (req, res) => {
    try {
      const job = new Job(req.body);
      await job.save();
      res.status(201).json(job);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get('/api/jobs', async (req, res) => {
    try {
      const { status, sort } = req.query;
      let query = {};
      if (status) query.status = status;
      let jobs = await Job.find(query);
      if (sort === 'date') jobs = jobs.sort((a, b) => new Date(b.dateOfApplication) - new Date(a.dateOfApplication));
      res.json(jobs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/jobs/:id', async (req, res) => {
    try {
      const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(job);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete('/api/jobs/:id', async (req, res) => {
    try {
      await Job.findByIdAndDelete(req.params.id);
      res.json({ message: 'Job deleted' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
