import { Schema, model } from 'mongoose';

const jobSchema = new Schema({
  company: String,
  role: String,
  status: {
    type: String,
    enum: ['Applied', 'Interview', 'Offer', 'Rejected'],
    default: 'Applied'
  },
  dateOfApplication: Date,
  link: String
});

export default model('job', jobSchema);
