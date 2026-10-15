
const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/studentdb')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Student Schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  course: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true }
});

const Student = mongoose.model('Student', studentSchema);

// CREATE: Add a student
app.post('/api/students', async (req, res) => {
  try {
    let student = new Student({
      name: req.body.name,
      age: req.body.age,
      course: req.body.course,
      rollNumber: req.body.rollNumber
    });

    student = await student.save();
    res.status(201).send(student);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// READ ALL: Get all students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.send(students);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// READ ONE: Get student by ID
app.get('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).send({ message: 'Student not found.' });
    }
    res.send(student);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// UPDATE: Update a student
app.put('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        age: req.body.age,
        course: req.body.course,
        rollNumber: req.body.rollNumber
      },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).send({ message: 'Student not found.' });
    }
    res.send(student);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// DELETE: Delete a student
app.delete('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).send({ message: 'Student not found.' });
    }
    res.send({
      message: 'Student record deleted successfully.',
      student
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
