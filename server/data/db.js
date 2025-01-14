const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(path.join(__dirname, "shop.db"), (err) => {
    if(err) {
        console.error("Failed to connect to database: ", err);
    } else {
        console.log("Connected to database");
    }
});

module.exports = db;