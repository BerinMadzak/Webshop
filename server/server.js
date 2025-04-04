const express = require("express");
const { body, validationResult } = require('express-validator');
const cors = require("cors");
const { getProducts, getCategories, createAccount, 
    getUserByUsername, getUserByEmail, getCartByUserId, getCartContents, 
    addToCart, changeItemQuantity, 
    createOrder,
    addItemToOrder,
    clearCart,
    getOrders,
    getOrderById,
    changePassword,
    addProduct,
    updateProduct,
    deleteProduct,
    categoryExists,
    addCategory,
    updateCategory,
    deleteCategory,
    getProductById,
    getUserId,
    getOrder,
    getActiveDiscounts,
    getActiveDiscoutById,
    deleteDiscount,
    addDiscount} = require("./data/queries");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const corsOptions = {
    origin: [process.env.FRONTEND],
    credentials: true
};

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

const SECRET_KEY = process.env.SECRET_KEY; 

// Products

app.get("/products", async (req, res) => {
    const category = req.query.category === undefined ? 'All' : req.query.category;
    const search = req.query.search === undefined ? '' : req.query.search;
    const products = await getProducts(category, search);
    res.json( products );
});

app.get("/products/:product_id", async (req, res) => {
    const product_id = req.params['product_id'];
    const product = await getProductById(product_id);
    res.json ( product );
});

app.get("/products/c/:category_id", async (req, res) => {
    const category = req.params['category_id'];
    const products = await getProducts(category, '');
    res.json( products );
});

app.post("/products", [
    body('name').notEmpty().withMessage('Name is required'),
    body('price').notEmpty().withMessage('Price is required').isNumeric().withMessage('Price must be a valid number')
    .custom(value => {
        if(value <= 0) throw new Error("Price must be a positive number");
        return true;
    }),
    body('image_url').notEmpty().withMessage("Image is required")
], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    addProduct(req.body);
    
    res.status(200).json({  message: `Added <span class="special-text">${req.body.name}</span> to database`} );
});

app.put("/products", [
    body('name').notEmpty().withMessage('Name is required'),
    body('price').notEmpty().withMessage('Price is required').isNumeric().withMessage('Price must be a valid number')
    .custom(value => {
        if(value <= 0) throw new Error("Price must be a positive number");
        return true;
    }),
    body('image_url').notEmpty().withMessage("Image is required")
], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    updateProduct(req.body);
    
    res.status(200).json({  message: `Product updated`} );
});

app.delete("/products", async (req, res) => {
    deleteProduct(req.body.product_id);

    res.status(200).json( {message: `Deleted <span class="special-text">${req.body.name}</span> from database`});
});

app.post("/add", async(req, res) => {
    const data = req.body;
try {
    await addToCart(data);
    const contents = await getCartContents(data.cart_id);
    res.status(200).json( { 
        contents: contents, 
        message: `Added <span class="special-text">${contents.find(el => el.product_id === data.product_id).name} x${data.quantity}</span> to cart`} 
    );
} catch(err) {
    res.status(500).json({ message: err.message });
}
});

// Categories

app.get("/categories", async (req, res) => {
    const categories = await getCategories();
    res.json( categories );
});

app.post("/categories", [
    body('name').notEmpty().withMessage('Name is required').custom(async(value) => {
        const category = await categoryExists(value);
        if(category) throw new Error('A category with that name already exists');
        return true;
    })
], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    addCategory(req.body);
    
    res.status(200).json({  message: `Added <span class="special-text">${req.body.name}</span> category to database`} );
});

app.put("/categories", [
    body('name').notEmpty().withMessage('Name is required').custom(async(value) => {
        const category = await categoryExists(value);
        if(category) throw new Error('A category with that name already exists');
        return true;
    })
], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    updateCategory(req.body);
    
    res.status(200).json({  message: `Category updated`} );
});

app.delete("/categories", async (req, res) => {
    deleteCategory(req.body.category_id);

    res.status(200).json( {message: `Deleted <span class="special-text">${req.body.name}</span> category from database`});
});

// Cart

app.get("/contents/:cart_id", async (req, res) => {
    const cart_id = req.params['cart_id'];
    const contents = await getCartContents(cart_id);
    res.json ( contents );
});

app.post("/quantity", async(req, res) => {
    const data = req.body;
    await changeItemQuantity(data);
    const contents = await getCartContents(data.cart_id);
    res.status(200).json( contents );
});

// Orders

app.get("/orders/:user_id", async (req, res) => {
    const user_id = req.params['user_id'];
    const orders = await getOrders(user_id);
    res.json ( orders );
});

app.get("/order/:order_id", async (req, res) => {
    const order_id = req.params['order_id'];
    const order = await getOrderById(order_id);
    res.status(200).json ( order );
});

app.get("/order/c/:order_id", async (req, res) => {
    const order_id = req.params['order_id'];
    const order = await getOrder(order_id);
    if(order.length === 0) res.status(404).json({ message: "Order with that id doesn't exist"});
    else res.status(200).json ( order );
});

app.post("/order", async(req, res) => {
    const data = req.body;
    const order_id = await createOrder(data);
    for(let i = 0; i < data.products.length; i++) {
        const p = data.products[i];
        const productData = {
            order_id: order_id,
            product_id: p.product_id,
            quantity: p.quantity, 
            price: p.discounted_price ? p.discounted_price : p.price
        };
        await addItemToOrder(productData);
    }
    await clearCart(data.user_id);
    const contents = await getCartContents(data.cart_id);
    res.status(200).json({ message: "Order created", contents: contents});
});

// Discounts

app.get("/discounts", async (req, res) => {
    const discounts = await getActiveDiscounts();
    res.status(200).json ( discounts );
});

app.get("/discounts/:product_id", async (req, res) => {
    const product_id = req.params['product_id'];
    const discount = await getActiveDiscoutById(product_id);
    res.status(200).json ( discount );
});

app.post("/discounts", [
    body('product_id').custom(async(value) => {
        const discount = await getActiveDiscoutById(value);
        if(discount) throw new Error('Product already has an active discount');
        return true;
    }),
    body('amount').notEmpty().withMessage('Amount is required').isNumeric().withMessage("Must be a valid number")
    .custom(value => {
        if(value < 1 || value > 99) throw new Error('Amount must be between 1% and 99%');
        return true;
    }),
    body('end_date').notEmpty().withMessage("End date is required").isDate().withMessage("Must be a valid date")
    .custom(value => {
        const today = new Date();
        const inputDate = new Date(value);
        if(inputDate <= today) throw new Error('End date cannot be in the past');
        return true;
    })
], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    addDiscount(req.body);
    
    res.status(200).json({  message: `Added discount`} );
});

app.delete("/discounts", async (req, res) => {
    deleteDiscount(req.body.discount_id);

    res.status(200).json( {message: `Deleted discount`});
});

// Account

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

app.post("/changePassword", [
    body('oldPassword').custom(async(value, { req }) => {
        const user = await getUserByUsername(req.body.username);
        if(user) {
            const match = await bcrypt.compare(value, user.password_hash);
            if(!match) {
                throw new Error('Incorrect password');
            }
        }
        return true;
    }),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('passwordConfirm').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match')
], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    console.log("Success");
    changePassword(req.body);
    
    res.status(200).json({ message: 'Password changed succesfully' });
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

    const username = req.body.username;
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

    res.cookie('token', token, {
        httpOnly: true,
        //secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000
    });

    const user = await getUserByUsername(username);
    const cart = await getCartByUserId(user.user_id);
    const contents = await getCartContents(cart.cart_id);
    
    res.status(200).json({ message: 'Succesful Login', user: user, cart: cart, contents: contents });
});

app.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        //secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({ message: 'Logged out' });
});

app.get("/account", async (req, res) => {
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({ message: 'No token' });
    }

    jwt.verify(token, SECRET_KEY, async (err, data) => {
        if(err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        const user = await getUserByUsername(data.username); 
        const cart = await getCartByUserId(user.user_id);
        const contents = await getCartContents(cart.cart_id);    
        res.status(200).json({ user: user, cart: cart, contents: contents });
    })
});

app.get("/userid/:username", async (req, res) => {
    const username = req.params['username'];
    const user_id = await getUserId(username);
    if(user_id === undefined) res.status(404).json({ message: "User does not exist" });
    else res.status(200).json( user_id );
});

app.get("/test", (req, res) => {
    res.status(200).json({ message: "Server is running" });
})

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
