const db = require("./db");

async function getAll(query, params) {
    return new Promise(function(resolve, reject){ 
        db.all(query, params, function(err, rows) {
            if(err) return reject(err);
            resolve(rows);
        });
    }) ;
}

async function getProducts(category) {
    let sql = `SELECT * FROM products`;
    const params = [];
    if(category !== "All") {
        sql += " WHERE category_id = ?";
        params.push(category);
    }
    const result = await getAll(sql, params);
    return result;
}

async function getCategories() {
    const sql = `SELECT * FROM categories`;
    const result = await getAll(sql);
    return result;
}


module.exports = { getProducts, getCategories };
