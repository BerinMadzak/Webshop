const db = require("./db");

async function getAll(query, params) {
    return new Promise(function(resolve, reject){ 
        db.all(query, params, function(err, rows) {
            if(err) return reject(err);
            resolve(rows);
        });
    }) ;
}

async function getProducts(category, search) {
    let sql = `SELECT * FROM products`;
    const params = [];
    console.log("S: " + search);
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
    const sql = `SELECT * FROM categories`;
    const result = await getAll(sql);
    return result;
}


module.exports = { getProducts, getCategories };
