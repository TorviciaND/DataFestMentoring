const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000; // Allow dynamic port assignment

app.use(express.json());
app.use(cors()); // Allow frontend to access backend

const FILE_PATH = "/tmp/signups.json"; // Use Render's temp storage

// Load signups from file asynchronously
const loadSignups = async () => {
    try {
        if (fs.existsSync(FILE_PATH)) {
            const data = await fs.promises.readFile(FILE_PATH, "utf8");
            return JSON.parse(data);
        }
        return {};
    } catch (error) {
        console.error("Error loading signups:", error);
        return {};
    }
};

// Save signups to file asynchronously
const saveSignups = async (signups) => {
    try {
        await fs.promises.writeFile(FILE_PATH, JSON.stringify(signups, null, 2), "utf8");
    } catch (error) {
        console.error("Error saving signups:", error);
    }
};

// API to get all signups
app.get("/signups", async (req, res) => {
    const signups = await loadSignups();
    res.json(signups);
});

// API to update signups
app.post("/signups", async (req, res) => {
    const signups = await loadSignups();
    signups[req.body.slotKey] = req.body.names;
    await saveSignups(signups);
    res.json({ success: true, signups });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
