const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = new sqlite3.Database("./users.db");
app.use(express.static("public"));

// FORCE ORDERED EXECUTION
db.serialize(() => {

    db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
    `);

    db.run(`
    INSERT OR IGNORE INTO users (username,password)
    VALUES ('admin','123456')
    `);

});

// LOGIN API
app.get("/", (req, res) => {
    res.send("Server is running bro 🚀");
});
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.get(
        "SELECT * FROM users WHERE username=? AND password=?",
        [username, password],
        (err, row) => {
            if (err) return res.status(500).send("Server error");
            if (!row) return res.status(401).send("Invalid login");
            res.send("Login success");
        }
    );
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));