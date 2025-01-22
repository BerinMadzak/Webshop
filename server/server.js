const express = require("express");
const cors = require("cors");
const { getProducts, getCategories } = require("./data/queries");

const app = express();
const corsOptions = {
    origin: ["http://localhost:5173"]
};

app.use(cors(corsOptions));

app.get("/products", async (req, res) => {
    const category = req.query.category;
    const products = await getProducts(category);
    res.json( products );
});

app.get("/categories", async (req, res) => {
    const categories = await getCategories();
    res.json( categories );
});

app.listen(8080, () => {
    console.log("Server started on port 8080");
});
