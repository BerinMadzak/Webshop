const express = require("express");
const cors = require("cors");
const { getProducts } = require("./data/queries");

const app = express();
const corsOptions = {
    origin: ["http://localhost:5173"]
};

app.use(cors(corsOptions));

app.get("/products", async (req, res) => {
    const products = await getProducts();
    res.json( products );
});

app.listen(8080, () => {
    console.log("Server started on port 8080");
});
