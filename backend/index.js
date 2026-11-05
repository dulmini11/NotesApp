import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 8800;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- MongoDB ----------
const noteSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        category: { type: String, default: "Uncategorized" },
        desc: { type: String, default: "" },
        cover: { type: String, default: "" },
        isPinned: { type: Boolean, default: false },
        isArchived: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true, // adds createdAt / updatedAt
        toJSON: {
            // The frontend uses `idNote`, so expose _id under that name
            transform: (_doc, ret) => {
                ret.idNote = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

const Note = mongoose.model("Note", noteSchema);

// Rejects invalid ids before they reach MongoDB (would otherwise throw CastError)
const validId = (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(404).json({ message: "Note not found" });
    }
    next();
};

// ---------- Uploads ----------
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("Uploads directory created");
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only image files are allowed!"), false);
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter,
});

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static(uploadDir));

// ---------- Routes ----------
app.get("/", (req, res) => {
    res.json("Hello! This is the backend");
});

app.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    const imageUrl = `${BASE_URL}/uploads/${req.file.filename}`;
    res.json({
        url: imageUrl,
        filename: req.file.filename,
        message: "Image uploaded successfully",
    });
});

// Get all notes (not in trash)
app.get("/note", async (req, res) => {
    try {
        const notes = await Note.find({ isDeleted: false }).sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Trash notes (must be ABOVE /note/:id)
app.get("/note/trash", async (req, res) => {
    try {
        const notes = await Note.find({ isDeleted: true }).sort({ updatedAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Archived notes (must be ABOVE /note/:id)
app.get("/note/archived", async (req, res) => {
    try {
        const notes = await Note.find({ isArchived: true, isDeleted: false }).sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single note
app.get("/note/:id", validId, async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, isDeleted: false });
        if (!note) return res.status(404).json({ message: "Note not found" });
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a note
app.post("/note", async (req, res) => {
    try {
        const note = await Note.create({
            title: req.body.title,
            category: req.body.category || "Uncategorized",
            desc: req.body.desc || "",
            cover: req.body.cover || "",
        });
        res.json({ message: "Note added successfully!", insertedId: note._id.toString() });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Update a note
app.put("/note/:id", validId, async (req, res) => {
    try {
        const { title, category, desc, cover } = req.body;
        await Note.findByIdAndUpdate(req.params.id, { title, category, desc, cover });
        res.json("Note has been updated successfully.");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Pin / unpin
app.put("/note/:id/pin", validId, async (req, res) => {
    try {
        const isPinned = Boolean(req.body.isPinned);
        await Note.findByIdAndUpdate(req.params.id, { isPinned });
        res.json({ message: "Note pin status updated", isPinned });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Archive / unarchive
app.put("/note/:id/archive", validId, async (req, res) => {
    try {
        const isArchived = Boolean(req.body.isArchived);
        await Note.findByIdAndUpdate(req.params.id, { isArchived });
        res.json({ message: isArchived ? "Note archived" : "Note unarchived", isArchived });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Restore from trash
app.put("/note/:id/restore", validId, async (req, res) => {
    try {
        await Note.findByIdAndUpdate(req.params.id, { isDeleted: false });
        res.json("Note restored successfully.");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Move to trash (soft delete)
app.delete("/note/:id", validId, async (req, res) => {
    try {
        await Note.findByIdAndUpdate(req.params.id, { isDeleted: true });
        res.json("Note moved to trash.");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Permanently delete
app.delete("/note/:id/permanent", validId, async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.json("Note permanently deleted.");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Error handling middleware (multer etc.)
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ error: "File too large. Maximum size is 5MB." });
        }
        return res.status(400).json({ error: error.message });
    }
    if (error) return res.status(400).json({ error: error.message });
    next();
});

// ---------- Start ----------
if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is missing. Add it to backend/.env");
    process.exit(1);
}

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected to database:", mongoose.connection.name);
        app.listen(PORT, () => {
            console.log(`Connected to backend at port ${PORT}!`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    });
