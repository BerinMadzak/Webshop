const express = require("express");
const { body, validationResult } = require('express-validator');
const cors = require("cors");
const { getProducts, getCategories, createAccount, getUserByUsername, getUserByEmail, getCartByUserId, getCartContents, addToCart } = require("./data/queries");
const bcrypt = require("bcryptjs");

const app = express();
const corsOptions = {
    origin: ["http://localhost:5173"]
};

app.use(express.json());
app.use(cors(corsOptions));

app.get("/products", async (req, res) => {
    const category = req.query.category;
    const search = req.query.search;
    const products = await getProducts(category, search);
    res.json( products );
});

app.get("/categories", async (req, res) => {
    const categories = await getCategories();
    res.json( categories );
});

app.get("/contents/:cart_id", async (req, res) => {
    const cart_id = req.params['cart_id'];
    const contents = await getCartContents(cart_id);
    res.json ( contents );
});

app.post("/add", async(req, res) => {
    const data = req.body;
    await addToCart(data);
    const contents = await getCartContents(data.cart_id);
    res.status(200).json( contents );
});

app.post("/signup", [
    body('username').notEmpty().withMessage('Username is required').custom(async(value) => {
        const user = await getUserByUsername(value);
        if(user) throw new Error('Username already exists');
        return true;
    }),
    body('email').isEmail().withMessage('Invalid email format').custom(async(value) => {
        const user = await getUserByEmail(value);
        if(user) throw new Error('Email already in use');
        return true;
    }),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('passwordConfirm').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('address').notEmpty().withMessage('Address is required')
], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    createAccount(req.body);
    
    res.status(200).json({ message: 'Account created successfuly' });
});

app.post("/login", [
    body('username').notEmpty().withMessage('Username is required').custom(async(value) => {
        const user = await getUserByUsername(value);
        if(!user) throw new Error('Username does not exist');
        return true;
    }),
    body('password').custom(async(value, { req }) => {
        const user = await getUserByUsername(req.body.username);
        if(user) {
            const match = await bcrypt.compare(value, user.password_hash);
            if(!match) {
                throw new Error('Incorrect password');
            }
        }
        return true;
    }),
], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const user = await getUserByUsername(req.body.username);
    const cart = await getCartByUserId(user.user_id);
    const contents = await getCartContents(cart.cart_id);
    
    res.status(200).json({ message: 'Succesful Login', user: user, cart: cart, contents: contents });
});

app.listen(8080, () => {
    console.log("Server started on port 8080");
});
