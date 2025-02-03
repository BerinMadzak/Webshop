const db = require("./db");
const bcrypt = require("bcryptjs");

async function getAll(query, params = []) {
    return new Promise(function(resolve, reject){ 
        db.all(query, params, function(err, rows) {
            if(err) return reject(err);
            resolve(rows);
        });
    });
}

function runAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if(err) reject(err);
            else resolve(this);
        });
    });
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

async function getCartByUserId(user_id) {
    const sql = `SELECT * FROM Carts WHERE user_id = ?`;
    const result = await getAll(sql, [user_id]);
    if(result.length > 0) return result[0];
    else {
        const cart = await createCart(user_id);
        return cart;
    }
}

async function createCart(user_id) {
    const sql = `INSERT INTO Carts(user_id) VALUES(?)`;
    const result = await runAsync(sql, [user_id]);
    const cart_id = result.lastID;
    
    const sql2 = `SELECT * FROM Carts WHERE cart_id = ?`;
    const cart = await getAll(sql2, [cart_id]);
    return cart[0];
}

async function addToCart(data) {
    const sql = `SELECT * FROM Cart_Items WHERE product_id = ? AND cart_id = ?`;
    const result = await getAll(sql, [data.product_id, data.cart_id]);
    if(result.length > 0) {
        const sql2 = `UPDATE Cart_Items SET quantity = ? WHERE cart_item_id = ?`;
        await runAsync(sql2, [result[0].quantity + data.quantity, result[0].cart_item_id]);
        return result[0].cart_item_id;
    } else {
        const sql2 = `INSERT INTO Cart_Items (cart_id, product_id, quantity) VALUES (?, ?, ?)`;
        const result2 = await runAsync(sql2, [data.cart_id, data.product_id, data.quantity]);
        return result2.lastID;
    }
}

async function changeItemQuantity(data) {
    if(data.quantity === 0) {
        const sql = `DELETE FROM Cart_Items WHERE product_id = ?`;
        await runAsync(sql, [data.product_id]);
        return;
    }
    else {
        const sql = `UPDATE Cart_Items SET quantity = ? WHERE product_id = ?`;
        await runAsync(sql, [data.quantity, data.product_id]);
        return;
    }
}

async function getCartContents(cart_id) {
    const sql = `SELECT p.product_id, p.name, p.price, p.image_url, ci.quantity, (p.price * ci.quantity) AS total_price 
                FROM Products p 
                JOIN Cart_Items ci ON p.product_id = ci.product_id 
                JOIN Carts c ON ci.cart_id = c.cart_id
                WHERE c.cart_id = ?`;
    const result = await getAll(sql, [cart_id]);
    return result;
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

async function createOrder(data) {
    const sql = `INSERT INTO Orders (user_id, total_price) VALUES (?, ?)`;
    const result = await runAsync(sql, [data.user_id, data.total_price]);
    return result.lastID;
}

async function addItemToOrder(data) {
    const sql = `INSERT INTO Order_Items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`;
    const result = runAsync(sql, [data.order_id, data.product_id, data.quantity, data.price]);
    return result.lastID;
}

async function clearCart(cart_id) {
    const sql = `DELETE FROM Cart_Items WHERE cart_id = ?`;
    await runAsync(sql, [cart_id]);
}


module.exports = { getProducts, getCategories, createAccount, getUserByUsername, 
                getUserByEmail, getCartByUserId, addToCart, getCartContents, changeItemQuantity,
                createOrder, addItemToOrder, clearCart };
