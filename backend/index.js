const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


require("dotenv").config();



mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("Mongo Error:", err));



const UserSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String
});

const User = mongoose.model("User", UserSchema);

const ComplaintSchema = new mongoose.Schema({
    name: String,
    email: String,
    title: {
        type: String,
        required: true
    },
    description: String,
    category: String,
    location: String,

    status: {
        type: String,
        default: "Pending"
    },

    aiPriority: String,
    aiDepartment: String,
    aiSummary: String,
    aiResponse: String,

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Complaint = mongoose.model("Complaint", ComplaintSchema);



const authMiddleware = (req, res, next) => {

    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            message: "Access Denied"
        });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({
            message: "Invalid Token"
        });
    }
};


const analyzeComplaint = (text="") => {

    let priority = "Low";
    let department = "General";
    let response = "Your complaint has been registered.";
    let summary = text.substring(0, 80);

    const lower = text.toLowerCase();

    if (lower.includes("water")) {
        department = "Water Department";
    }

    if (lower.includes("electricity")) {
        department = "Electricity Department";
        priority = "High";
    }

    if (lower.includes("garbage")) {
        department = "Sanitation Department";
    }

    if (
        lower.includes("urgent") ||
        lower.includes("danger") ||
        lower.includes("fire")
    ) {
        priority = "High";
    }

    response =
        `Complaint received. ${department} will contact you soon.`;

    return {
        priority,
        department,
        response,
        summary
    };
};



// SIGNUP

app.post("/api/auth/signup", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.json({
            message: "Signup Successful"
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
});

// LOGIN

app.post("/api/auth/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const validPassword =
            await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            token
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
});



// ADD COMPLAINT

app.post(
    "/api/complaints",
    authMiddleware,
    async (req, res) => {

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
            return res.status(400).json({
                message: "Title is required"
            });
        }

        const aiResult =
            analyzeComplaint(description);

        const complaint = new Complaint({
            name,
            email,
            title,
            description,
            category,
            location,

            aiPriority: aiResult.priority,
            aiDepartment: aiResult.department,
            aiSummary: aiResult.summary,
            aiResponse: aiResult.response
        });

        await complaint.save();

        res.json({
            message: "Complaint Added Successfully",
            complaint
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
});

// GET ALL COMPLAINTS

app.get(
    "/api/complaints",
    authMiddleware,
    async (req, res) => {

    try {

        const complaints =
            await Complaint.find();

        res.json(complaints);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
});

// UPDATE STATUS

app.put(
    "/api/complaints/:id",
    authMiddleware,
    async (req, res) => {

    try {

        const complaint =
            await Complaint.findByIdAndUpdate(
                req.params.id,
                {
                    status: req.body.status
                },
                {
                    new: true
                }
            );

        res.json(complaint);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
});

// SEARCH BY LOCATION

app.get(
    "/api/complaints/search",
    authMiddleware,
    async (req, res) => {

    try {

        const location =
            req.query.location;

        const complaints =
            await Complaint.find({
                location: {
                    $regex: location,
                    $options: "i"
                }
            });

        res.json(complaints);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
});



app.post(
    "/api/ai/analyze",
    authMiddleware,
    (req, res) => {

    const result =
        analyzeComplaint(req.body.text);

    res.json(result);
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});