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
  MAD: Number,
  COA: Number,
  IP: Number,
  WEBX: Number,
});

const Marks = mongoose.model('Marks', marksSchema);

// Endpoint to submit marks
app.post('/submit', async (req, res) => {
  const { MAD, COA, IP, WEBX } = req.body;
  try {
    // Save marks to the database
    const newMarks = new Marks({ MAD, COA, IP, WEBX });
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
