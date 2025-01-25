const db = require("./db");
const bcrypt = require("bcryptjs");

async function getAll(query, params) {
    return new Promise(function(resolve, reject){ 
        db.all(query, params, function(err, rows) {
            if(err) return reject(err);
            resolve(rows);
        });
    }) ;
}

async function getProducts(category, search) {
    let sql = `SELECT * FROM Products`;
    const params = [];
    if(category !== "All") {
        sql += " WHERE category_id = ?";
        params.push(category);
    }
    if(search !== "") {
        if(category !== "All") sql += " AND";
        else sql += " WHERE";
        sql += " name LIKE ?";
        params.push("%"+search+"%");
    }
    const result = await getAll(sql, params);
    return result;
}

async function getCategories() {
    const sql = `SELECT * FROM Categories`;
    const result = await getAll(sql);
    return result;
}

async function getUserByUsername(username) {
    const sql = `SELECT * FROM Users WHERE username = ?`;
    const result = await getAll(sql, [username]);
    if(result.length > 0) return result[0];
    else return null;
}

async function getUserByEmail(email) {
    const sql = `SELECT * FROM Users WHERE email = ?`;
    const result = await getAll(sql, [email]);
    if(result.length > 0) return result[0];
    else return null;
}

function createAccount(data) {
    const sql = `INSERT INTO Users (username, email, password_hash, first_name, last_name, phone_number, address)
                 VALUES(?, ?, ?, ?, ?, ?, ?)`;

    bcrypt.hash(data.password, 10, async(err, hashedPassword) => {
        if(err) return console.error(err.message);

        db.run(sql, [data.username, data.email, hashedPassword, data.firstName, data.lastName, data.phone, data.address], (err) => {
            if(err) return console.error(err.message);
        });
    });
}


module.exports = { getProducts, getCategories, createAccount, getUserByUsername, getUserByEmail };
