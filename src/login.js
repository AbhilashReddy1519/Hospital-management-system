const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "yourpassword",
    database: "HospitalDB",
});

// Login route
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Fetch user with the provided email
    const sql = "SELECT * FROM Users WHERE email = ?";
    db.execute(sql, [email], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Database error occurred.");
        }

        if (results.length === 0) {
            // User not found
            return res.status(401).send("Invalid email or password.");
        }

        const user = results[0];

        // Compare password hashes
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Internal error occurred.");
            }

            if (!isMatch) {
                // Password mismatch
                return res.status(401).send("Invalid email or password.");
            }

            // Password matches, login successful
            // Redirect to dashboard or return success response
            res.send("Login successful!");
        });
    });
});

// Start the server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});