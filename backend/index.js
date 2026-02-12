import express from "express";
import mysql from "mysql2";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';

const app = express();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "node_app",
    port: 3307 
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.log("MySQL Connection Error:", err);
        return;
    }
    console.log("MySQL connected to database:", db.config.database);
});

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Uploads directory created');
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Create unique filename with timestamp + random number + original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: { 
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadDir));

// Test Route
app.get("/", (req, res) => {
    res.json("Hello! This is the backend");
});

// Image upload endpoint
app.post("/upload", upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        
        // Generate the URL for the uploaded image
        const imageUrl = `http://localhost:8800/uploads/${req.file.filename}`;
        
        console.log('File uploaded successfully:', req.file.filename);
        console.log('Image URL:', imageUrl);
        
        res.json({ 
            url: imageUrl,
            filename: req.file.filename,
            message: "Image uploaded successfully" 
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message || "Upload failed" });
    }
});

// Get All Notes
app.get("/note", (req, res) => {
    const q = "SELECT * FROM note WHERE isDeleted = 0";

    db.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// Add a Note
app.post("/note", (req, res) => {
    const q = "INSERT INTO note (`title`, `category`, `desc`, `cover`) VALUES (?)";

    const values = [
        req.body.title,
        req.body.category || "Uncategorized",
        req.body.desc || "",
        req.body.cover || "",
    ];

    db.query(q, [values], (err, data) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: err.message });
        }

        return res.json({
            message: "Note added successfully!",
            insertedId: data.insertId
        });
    });
});

app.delete("/note/:id", (req, res) => {
    const noteId = req.params.id;
    const q = "UPDATE note SET isDeleted = 1 WHERE idNote = ?";

    db.query(q, [noteId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Note moved to trash.");
    });
});

app.put("/note/:id", (req, res) => {
    const noteId = req.params.id;
    const q = "UPDATE note SET `title`=?, `category`=?, `desc`=?, `cover`=? WHERE idNote = ?";

    const values = [
        req.body.title,
        req.body.category,
        req.body.desc,
        req.body.cover
    ];

    db.query(q, [...values, noteId], (err, data) => {
        if (err) return res.json(err);
        return res.json("Note has been updated successfully.");
    });
});

// Pin or unpin a note
app.put("/note/:id/pin", (req, res) => {
  const noteId = req.params.id;
  const { isPinned } = req.body; // true or false
  
  const q = "UPDATE note SET isPinned = ? WHERE idNote = ?";
  
  db.query(q, [isPinned, noteId], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    return res.status(200).json({ 
      message: "Note pin status updated",
      isPinned: isPinned 
    });
  });
});

// Start Server
app.listen(8800, () => {
    console.log("Connected to backend at port 8800!");
    console.log("Uploads directory:", uploadDir);
});

// TRASH NOTES (must be ABOVE :id)
app.get("/note/trash", (req, res) => {
    const q = "SELECT * FROM note WHERE isDeleted = 1";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

// GET SINGLE NOTE
app.get("/note/:id", (req, res) => {
    const noteId = req.params.id;
    const q = "SELECT * FROM note WHERE idNote = ? AND isDeleted = 0";

    db.query(q, [noteId], (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0)
            return res.status(404).json({ message: "Note not found" });
        return res.json(data[0]);
    });
});

app.delete("/note/:id/permanent", (req, res) => {
    const noteId = req.params.id;
    const q = "DELETE FROM note WHERE idNote = ?";

    db.query(q, [noteId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Note permanently deleted.");
    });
});

app.put("/note/:id/restore", (req, res) => {
    const noteId = req.params.id;
    const q = "UPDATE note SET isDeleted = 0 WHERE idNote = ?";

    db.query(q, [noteId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Note restored successfully.");
    });
});

// GET Archived Notes
app.get("/note/archived", (req, res) => {
    const q = "SELECT * FROM note WHERE isArchived = 1 AND isDeleted = 0";
    
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

// Archive a Note
app.put("/note/:id/archive", (req, res) => {
    const noteId = req.params.id;
    const { isArchived } = req.body;
    
    const q = "UPDATE note SET isArchived = ? WHERE idNote = ?";
    
    db.query(q, [isArchived, noteId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json({ 
            message: isArchived ? "Note archived" : "Note unarchived",
            isArchived: isArchived 
        });
    });
});

// Error handling middleware for multer
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'FILE_TOO_LARGE') {
            return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ error: error.message });
    } else if (error) {
        return res.status(400).json({ error: error.message });
    }
    next();
});