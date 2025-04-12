import express, { json } from 'express';
import { connect, model, Schema } from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(json());

// ✅ Define Mongoose schema and model
const jobSchema = new Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  status: {
    type: String,
    enum: ['Applied', 'Interview', 'Offer', 'Rejected'],
    default: 'Applied'
  },
  dateOfApplication: { type: Date },
  link: { type: String }
});

const Job = model('Job', jobSchema);

// ✅ MongoDB connection
connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

  console.log('🛠 Setting up routes...');

app.get('/', (req, res) => {
  console.log('✅ Root route hit!');
  res.send('Welcome to the Student Job Tracker API!');
});

// ✅ Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the Student Job Tracker API!');
});

// ✅ Routes
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
    const query = status ? { status } : {};
    let jobs = await Job.find(query);

    if (sort === 'date') {
      jobs = jobs.sort(
        (a, b) =>
          new Date(b.dateOfApplication) - new Date(a.dateOfApplication)
      );
    }

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
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
