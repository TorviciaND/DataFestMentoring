const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors()); // Allow frontend to access backend

const FILE_PATH = "signups.json";

// Load signups from file
const loadSignups = () => {
    if (fs.existsSync(FILE_PATH)) {
        return JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));
    }
    return {};
};

// Save signups to file
const saveSignups = (signups) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(signups, null, 2), "utf8");
};

// API to get all signups
app.get("/signups", (req, res) => {
    res.json(loadSignups());
});

// API to update signups
app.post("/signups", (req, res) => {
    const signups = loadSignups();
    signups[req.body.slotKey] = req.body.names;
    saveSignups(signups);
    res.json({ success: true, signups });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});