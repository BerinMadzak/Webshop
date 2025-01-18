const db = require("./db");

async function getAll(query) {
    return new Promise(function(resolve, reject){ 
        db.all(query, function(err, rows) {
            if(err) return reject(err);
            resolve(rows);
        });
    }) ;
}

async function getProducts() {
    const sql = `SELECT * FROM products`;
    const result = await getAll(sql);
    return result;
}

module.exports = { getProducts };
