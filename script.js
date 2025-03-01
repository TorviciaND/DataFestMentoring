let shifts = [
    { day: "Friday, March 21st", times: ["6:00 PM", "7:00 PM", "8:00 PM"] },
    { day: "Saturday, March 22nd", times: ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"] },
    { day: "Sunday, March 23rd", times: ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM"] }
];

let signups = {};

// Fetch signups from server
async function loadSignups() {
    try {
        const response = await fetch("http://localhost:3000/signups");
        signups = await response.json();
        renderCalendar();
    } catch (error) {
        console.error("Error loading signups:", error);
    }
}

// Save signups to server
async function saveSignup(slotKey) {
    try {
        await fetch("http://localhost:3000/signups", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slotKey, names: signups[slotKey] })
        });
    } catch (error) {
        console.error("Error saving signup:", error);
    }
}

// Render the calendar
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
            timeSlot.innerHTML = `
                <span>${time}</span>
                <button onclick="toggleSignup('${slotKey}')">${signups[slotKey].includes(getCurrentName()) ? "Unselect" : "Select"}</button>
                <p>${signups[slotKey].join("<br>") || ""}</p>
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
        signups[slotKey] = signups[slotKey].filter(n => n !== name);
    } else {
        signups[slotKey].push(name);
    }

    saveSignup(slotKey);
    renderCalendar();
}

loadSignups();
