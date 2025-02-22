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
    let sql = `SELECT p.*, d.amount as discount_amount, Round((p.price - p.price * (d.amount/100)), 2) as discounted_price 
        FROM Products p LEFT JOIN Discounts d ON p.product_id = d.product_id`;
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
    sql += " ORDER BY name";
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
    const sql = `SELECT p.product_id, p.name, p.price, p.image_url, ci.quantity,
                d.amount as discount_amount, Round((p.price - p.price * (d.amount/100)), 2) as discounted_price,
                ROUND(
                CASE
                    WHEN d.amount IS NOT NULL 
                    THEN (p.price - p.price * (d.amount/100)) * ci.quantity
                    ELSE p.price * ci.quantity
                END, 2) AS total_price
                FROM Products p 
                LEFT JOIN Discounts d on p.product_id = d.product_id
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

function changePassword(data) {
    const sql = `UPDATE Users SET password_hash = ? WHERE user_id = ?`;

    bcrypt.hash(data.password, 10, async(err, hashedPassword) => {
        if(err) return console.error(err.message);

        db.run(sql, [hashedPassword, data.user_id], (err) => {
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

async function getOrders(user_id) {
    const sql = `SELECT o.order_id, o.total_price, o.order_date, SUM(oi.quantity) AS total_quantity FROM Orders o
    LEFT JOIN order_items oi ON o.order_id = oi.order_id WHERE o.user_id = ?
    GROUP BY o.order_id, o.total_price, o.order_date
    ORDER BY order_date`;
    const result = await getAll(sql, [user_id]);
    return result;
}

async function getOrder(order_id) {
    const sql = `SELECT o.order_id, o.total_price, o.order_date, SUM(oi.quantity) AS total_quantity FROM Orders o
    LEFT JOIN order_items oi ON o.order_id = oi.order_id WHERE o.order_id = ?
    GROUP BY o.order_id, o.total_price, o.order_date
    ORDER BY order_date`;
    const result = await getAll(sql, [order_id]);
    return result;
}

async function getOrderById(order_id) {
    const sql = `SELECT oi.product_id, oi.price, oi.quantity, oi.quantity * oi.price AS total_price, p.name, p.image_url
    FROM order_items oi JOIN products p ON oi.product_id = p.product_id
    WHERE oi.order_id = ?`;
    const result = await getAll(sql, [order_id]);
    return result;
}

function addProduct(data) {
    const sql = `INSERT INTO Products (category_id, name, description, price, image_url)
                 VALUES(?, ?, ?, ?, ?)`;

    db.run(sql, [data.category_id, data.name, data.description, data.price, data.image_url], (err) => {
        if(err) return console.error(err.message);
    });
}

function updateProduct(data) {
    const sql = `UPDATE Products SET category_id = ?, name= ?, description = ?, price = ?, image_url = ? WHERE product_id = ?`;

    db.run(sql, [data.category_id, data.name, data.description, data.price, data.image_url, data.product_id], (err) => {
        if(err) return console.error(err.message);
    });
}

function deleteProduct(product_id) {
    const sql = `DELETE FROM Products WHERE product_id = ?`;
    
    db.run(sql, [product_id], (err) => {
        if(err) return console.error(err.message);
    });
}

async function categoryExists(name) {
    const sql = `SELECT * FROM Categories WHERE name = ?`;

    const result = await getAll(sql, [name]);
    if(result.length > 0) return true;
    return false;
}

function addCategory(data) {
    const sql = `INSERT INTO Categories (name) VALUES (?)`;
    db.run(sql, [data.name], (err) => {
        if(err) return console.error(err.message);
    });
}

function updateCategory(data) {
    const sql = `UPDATE Categories SET name = ? WHERE category_id = ?`;
    db.run(sql, [data.name, data.category_id], (err) => {
        if(err) return console.error(err.message);
    });
}

function deleteCategory(category_id) {
    const sql = `DELETE FROM Categories WHERE category_id = ?`;
    db.run(sql, [category_id], (err) => {
        if(err) return console.error(err.message);
    });
}

async function getProductById(product_id) {
    const sql = `SELECT p.*, d.amount as discount_amount, ROUND((p.price - p.price * (d.amount/100)), 2) as discounted_price 
        FROM Products p LEFT JOIN Discounts d ON p.product_id = d.product_id WHERE p.product_id = ?`;
    const result = await getAll(sql, [product_id], (err) => {
        if(err) return console.error(err.message);
    });
    return result[0];
}

async function getUserId(username) {
    const sql = `SELECT user_id FROM Users WHERE username = ?`;
    const result = await getAll(sql, [username], (err) => {
        if(err) return console.error(err.message);
    });
    return result[0];
}

function addDiscount(data) {
    const sql = `INSERT INTO Discounts (product_id, amount, end_date) VALUES (?, ?, ?)`;
    db.run(sql, [data.product_id, data.amount, data.end_date], (err) => {
        if(err) return console.error(err.message);
    });
}

async function getActiveDiscounts() {
    const sql = `SELECT d.discount_id, d.product_id, d.amount, d.end_date, p.name, p.price FROM Discounts d 
        JOIN Products p ON d.product_id = p.product_id
        WHERE end_date > CURRENT_DATE`;
    const result = await getAll(sql, [], (err) => {
        if(err) return console.error(err.message);
    });
    return result;
}

async function getActiveDiscoutById(product_id) {
    const sql = `SELECT d.product_id, d.amount, d.end_date, p.name, p.price FROM Discounts d 
        JOIN Products p ON d.product_id = p.product_id
        WHERE d.product_id = ? AND end_date > CURRENT_DATE`;
    const result = await getAll(sql, [product_id], (err) => {
        if(err) return console.error(err.message);
    });
    return result[0];
}

function deleteDiscount(discount_id) {
    const sql = `DELETE FROM Discounts WHERE discount_id = ?`;
    db.run(sql, [discount_id], (err) => {
        if(err) return console.error(err.message);
    });
}

module.exports = { getProducts, getCategories, createAccount, getUserByUsername, 
                getUserByEmail, getCartByUserId, addToCart, getCartContents, changeItemQuantity,
                createOrder, addItemToOrder, clearCart, getOrders, getOrderById, changePassword,
                addProduct, updateProduct, deleteProduct, categoryExists, addCategory, updateCategory,
                deleteCategory, getProductById, getUserId, getOrder, addDiscount, getActiveDiscounts,
                getActiveDiscoutById, deleteDiscount
            };
