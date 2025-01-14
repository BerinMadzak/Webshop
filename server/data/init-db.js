const db = require("./db")

// Queries
const dropTablesQuery = `
    DROP TABLE IF EXISTS Products;
    DROP TABLE IF EXISTS Categories;
`

const createTablesQuery = `
    CREATE TABLE IF NOT EXISTS Categories (
        category_id INTEGER PRIMARY KEY AUTOINCREMENT,
        parent_category_id INTEGER,
        name TEXT NOT NULL UNIQUE,
        FOREIGN KEY (parent_category_id) REFERENCES Categories(category_id)
    );

    CREATE TABLE IF NOT EXISTS Products (
        product_id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        image_url TEXT,
        FOREIGN KEY (category_id) REFERENCES Categories(category_id)
    );
`

const addDataQuery = `
    INSERT INTO Categories (name)
    VALUES ('Electronics'), ('Clothing'), ('Books');

    INSERT INTO Products (category_id, name, price, image_url)
    VALUES (1, 'Laptop', 100, 'url'), (2, 'Shirt', 10, 'url');
`

// Query Execution
db.exec(dropTablesQuery, (err) => {
    if(err) {
        console.log(err);
    } else {
        console.log("Dropped all tables");
    }
});

db.exec(createTablesQuery, (err) => {
    if(err) {
        console.log(err);
    } else {
        console.log("Created all tables");
    }
});

db.exec(addDataQuery, (err) => {
    if(err) {
        console.log(err);
    } else {
        console.log("Added data to tables");
    }
});

db.close();