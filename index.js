const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://aditya:aditya123@cluster0.zoiqagj.mongodb.net/student_marks', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

const marksSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  rollNo: String,
  MAD: Number,
  COA: Number,
  IP: Number,
  WEBX: Number,
});

const Marks = mongoose.model('Marks', marksSchema);

// Endpoint to submit marks
app.post('/submit', async (req, res) => {
  const { name, rollNo, MAD, COA, IP, WEBX } = req.body;
  try {
    // Save marks to the database
    const newMarks = new Marks({ name, rollNo, MAD, COA, IP, WEBX });
    await newMarks.save();
    res.status(200).json({ message: 'Marks submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to fetch marks
app.get('/marks', async (req, res) => {
  try {
    // Fetch all marks from the database
    const marks = await Marks.find();
    if (!marks || marks.length === 0) {
      res.status(404).json({ message: 'Marks data not found' });
      return;
    }
    res.status(200).json(marks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to fetch form data by username
app.get('/form/:username', async (req, res) => {
  const username = req.params.username;
  try {
    // Fetch form data by username from the database
    const formData = await Marks.findOne({ name: username });
    if (!formData) {
      res.status(404).json({ message: 'Form data not found for the username' });
      return;
    }
    res.status(200).json(formData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
