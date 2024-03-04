const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');

const app = express();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'image/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'yashi'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/insert', upload.single('image'), (req, res) => {
    const { role } = req.body;
    const image = req.file ? req.file.filename : null; 
    if (!role || !image) {
        return res.status(400).send('Role and image are required.');
    }
    const newData = { role, image };
    connection.query('INSERT INTO role SET ?', newData, (error, results, fields) => {
        if (error) {
            console.error('Error inserting data:', error);
            return res.status(500).send(`Error inserting data: ${error.message}`);
        }
        console.log('Data inserted successfully');
        res.send('Data inserted successfully');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
