const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Enable CORS so your GitHub Pages site can talk to this server
app.use(cors());

// Configure Storage for Files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './uploads';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        // Save file as: timestamp-originalName
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Handle Form Submission
app.post('/save-response', upload.single('attachment_file'), (req, res) => {
    const comment = req.body.user_comment;
    const file = req.file;

    // Log data to console (or save to a database)
    console.log("New Submission Received:");
    console.log("Comment:", comment);
    console.log("File:", file ? file.filename : "No file uploaded");

    // OPTIONAL: Save comment to a text file
    const logEntry = `Date: ${new Date().toISOString()}\nComment: ${comment}\nFile: ${file ? file.filename : 'None'}\n-------------------\n`;
    fs.appendFileSync('responses.txt', logEntry);

    // Redirect user to the original destination after saving
    res.redirect('https://cutt.ly/CtiVUXpC');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});