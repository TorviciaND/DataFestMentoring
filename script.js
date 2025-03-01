let shifts = [
    { day: "Friday, March 21st", times: ["6:00 PM", "7:00 PM", "8:00 PM"] },
    { day: "Saturday, March 22nd", times: ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"] },
    { day: "Sunday, March 23rd", times: ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM"] }
];

let signups = {};
const API_URL = "https://datafestmentoring-1.onrender.com/signups"; // Updated API URL

// Fetch signups from Render server
async function loadSignups() {
    try {
        const response = await fetch(API_URL);
        signups = await response.json();
        renderCalendar();
    } catch (error) {
        console.error("Error loading signups:", error);
    }
}

// Save signups to Render server
async function saveSignup(slotKey) {
    try {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slotKey, names: signups[slotKey] })
        });
    } catch (error) {
        console.error("Error saving signup:", error);
    }
}

// Render the calendar dynamically
function renderCalendar() {
    const calendarContainer = document.getElementById("calendar");
    calendarContainer.innerHTML = "";

    shifts.forEach((shift) => {
        const dayContainer = document.createElement("div");
        dayContainer.className = "day-container";
        dayContainer.innerHTML = `<h2>${shift.day}</h2>`;

        shift.times.forEach((time) => {
            const slotKey = `${shift.day} - ${time}`;
            if (!signups[slotKey]) signups[slotKey] = [];

            const timeSlot = document.createElement("div");
            timeSlot.className = "time-slot";

            const isSignedUp = signups[slotKey].includes(getCurrentName());
            timeSlot.innerHTML = `
                <span>${time}</span>
                <button onclick="toggleSignup('${slotKey}')">${isSignedUp ? "Unselect" : "Select"}</button>
                <p>${signups[slotKey].join("<br>")}</p>
            `;

            dayContainer.appendChild(timeSlot);
        });

        calendarContainer.appendChild(dayContainer);
    });
}

// Get the currently entered name
function getCurrentName() {
    return document.getElementById("name").value.trim();
}

// Update button states when name input changes
document.getElementById("name").addEventListener("input", () => renderCalendar());

// Toggle signup for a time slot
function toggleSignup(slotKey) {
    const name = getCurrentName();
    if (!name) {
        alert("Please enter your name first.");
        return;
    }

    if (signups[slotKey].includes(name)) {
        // Remove name from slot
        signups[slotKey] = signups[slotKey].filter(n => n !== name);
    } else {
        // Add name to slot
        signups[slotKey].push(name);
    }

    saveSignup(slotKey);
    renderCalendar();
}

// Load existing signups when page loads
loadSignups();
