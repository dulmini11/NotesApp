import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();

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

app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
    res.json("Hello! This is the backend");
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
        req.body.category,
        req.body.desc,
        req.body.cover,
    ];

    db.query(q, [values], (err, data) => {
        if (err) return res.json(err);

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
