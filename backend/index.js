const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OpenAI = require("openai");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   OPENROUTER CONFIG
========================= */

const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": "https://your-render-app.onrender.com",
        "X-Title": "AI Complaint Management System"
    }
});

/* =========================
   DATABASE CONNECTION
========================= */

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("Mongo Error:", err));

/* =========================
   HOME ROUTE
========================= */

app.get("/", (req, res) => {
    res.send("Backend Running Successfully");
});

/* =========================
   USER SCHEMA
========================= */

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
});

const User = mongoose.model("User", UserSchema);

/* =========================
   COMPLAINT SCHEMA
========================= */

const ComplaintSchema = new mongoose.Schema({
    name: String,
    email: String,
    title: { type: String, required: true },
    description: String,
    category: String,
    location: String,
    status: { type: String, default: "Pending" },

    aiResponse: String,

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Complaint = mongoose.model("Complaint", ComplaintSchema);

/* =========================
   JWT MIDDLEWARE
========================= */

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "Access Denied" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

/* =========================
   AI ANALYZER FUNCTION (UPDATED)
========================= */

const analyzeComplaint = async (text = "") => {
    try {
        const completion = await client.chat.completions.create({
            model: "openai/gpt-oss-20b:free",

            messages: [
                {
                    role: "system",
                    content: `
You are an AI Complaint Analyzer.

Return ONLY valid JSON (no markdown, no explanation).

JSON format:
{
  "priority": "Low | Medium | High | Critical",
  "department": "",
  "summary": "",
  "professionalResponse": ""
}

Rules:
- professionalResponse must be polite and structured
- Use placeholders like {{customer_name}} if name is unknown
- Keep response professional and concise
`
                },
                {
                    role: "user",
                    content: text
                }
            ],

            temperature: 0.4,
            max_tokens: 300
        });

        const raw = completion.choices[0].message.content;

        console.log("RAW AI:", raw);

        try {
            return JSON.parse(raw);
        } catch (err) {
            return {
                priority: "Medium",
                department: "Unknown",
                summary: raw,
                professionalResponse: "AI response parsing failed"
            };
        }

    } catch (err) {
        console.log("AI ERROR:", err.response?.data || err.message);

        return {
            priority: "Medium",
            department: "Unknown",
            summary: "AI analysis failed",
            professionalResponse: "Try again later"
        };
    }
};

/* =========================
   AUTH ROUTES
========================= */

// SIGNUP
app.post("/api/auth/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword });

        await user.save();

        res.json({ message: "Signup Successful" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: "Invalid Password" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ token });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* =========================
   COMPLAINT ROUTES
========================= */

// ADD COMPLAINT
app.post("/api/complaints", authMiddleware, async (req, res) => {
    try {
        const {
            name,
            email,
            title,
            description,
            category,
            location
        } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const aiResult = await analyzeComplaint(description);

        const complaint = new Complaint({
            name,
            email,
            title,
            description,
            category,
            location,
            aiResponse: JSON.stringify(aiResult)
        });

        await complaint.save();

        res.json({
            message: "Complaint Added Successfully",
            complaint: {
                ...complaint._doc,
                aiResponse: aiResult
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET ALL COMPLAINTS
app.get("/api/complaints", authMiddleware, async (req, res) => {
    try {
        const complaints = await Complaint.find();

        const formatted = complaints.map(c => ({
            ...c._doc,
            aiResponse: JSON.parse(c.aiResponse)
        }));

        res.json(formatted);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE STATUS
app.put("/api/complaints/:id", authMiddleware, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid Complaint ID" });
        }

        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );

        res.json(complaint);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// SEARCH BY LOCATION
app.get("/api/complaints/search", authMiddleware, async (req, res) => {
    try {
        const location = req.query.location;

        const complaints = await Complaint.find({
            location: { $regex: location, $options: "i" }
        });

        const formatted = complaints.map(c => ({
            ...c._doc,
            aiResponse: JSON.parse(c.aiResponse)
        }));

        res.json(formatted);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* =========================
   AI ANALYZER ROUTE
========================= */

app.post("/api/ai/analyze", authMiddleware, async (req, res) => {
    try {
        const result = await analyzeComplaint(req.body.text);

        res.json({ result });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});