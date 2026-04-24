const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'hms'
});

app.post('/add', (req, res) => {
  const { id,name, age } = req.body;
  db.query("INSERT INTO patients (id, name, age) VALUES (?, ?, ?)",
    [id,name, age],
    (err) => {
      if (err) throw err;
      res.send("Added");
    });
});

app.get('/patients', (req, res) => {
  db.query("SELECT * FROM patients", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get('/doctors', (req, res) => {
  db.query("SELECT * FROM doctors", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

// Book appointment
app.post('/appointment', (req, res) => {
  const { patient_id, doctor_id, date } = req.body;

  db.query(
    "INSERT INTO appointments (patient_id, doctor_id, date) VALUES (?, ?, ?)",
    [patient_id, doctor_id, date],
    () => res.send("Appointment booked")
  );
});

// Show patient + doctor (JOIN)
app.get('/full', (req, res) => {
  db.query(`
    SELECT p.name AS patient, d.name AS doctor, a.date
    FROM appointments a
    JOIN patients p ON a.patient_id = p.id
    JOIN doctors d ON a.doctor_id = d.id
  `, (err, result) => res.json(result));
});

// Book appointment
app.post('/appointment', (req, res) => {
  const { patient_id, doctor_id, date } = req.body;

  db.query(
    "INSERT INTO appointments (patient_id, doctor_id, date) VALUES (?, ?, ?)",
    [patient_id, doctor_id, date],
    () => res.send("Appointment booked")
  );
});

// Show patient + doctor (JOIN)
app.get('/full', (req, res) => {
  db.query(`
    SELECT p.id, p.name AS patient, d.name AS doctor, a.date
    FROM appointments a
    JOIN patients p ON a.patient_id = p.id
    JOIN doctors d ON a.doctor_id = d.id
  `, (err, result) => res.json(result));
});

app.delete('/delete/:id', (req, res) => {
  const id = req.params.id;

  // First delete from appointments
  db.query("DELETE FROM appointments WHERE patient_id = ?", [id], () => {

    // Then delete from patients
    db.query("DELETE FROM patients WHERE id = ?", [id],
      () => res.send("Deleted"));
  });
});