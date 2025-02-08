const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

const app = express();
const saltRounds = 10; // For password hashing

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "yourpassword",
    database: "HospitalDB",
});

// Signup route
app.post("/signup", async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Check if the email already exists
        const checkUserSql = "SELECT * FROM Users WHERE email = ?";
        db.execute(checkUserSql, [email], (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).send("An error occurred, please try again.");
            }

            if (results.length > 0) {
                // Email already in use
                res.status(409).send("Email is already in use. Please login.");
            } else {
                // Insert the new user into the database
                const insertUserSql = "INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)";
                db.execute(insertUserSql, [name, email, hashedPassword, role], (err, results) => {
                    if (err) {
                        console.error("Database error:", err);
                        return res.status(500).send("Failed to register user, please try again.");
                    }

                    // Redirect to index.html after successful registration
                    res.redirect("/index.html");
                });
            }
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("An internal error occurred.");
    }
});

// Serve static files (e.g., for index.html) from a public directory
app.use(express.static("public"));

// Start the server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});