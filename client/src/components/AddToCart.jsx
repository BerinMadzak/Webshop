import { useContext, useState } from "react";
import { ShopContext } from "../main";
import { useNavigate } from "react-router-dom";

export default function AddToCart({ product }) {
    const [count, setCount] = useState(1);

    const { account, cart, cartContents, setCartContents, setLoading, notification } = useContext(ShopContext);

    const navigate = useNavigate();

    function addToCart() {
        setCount(prev => prev + 1);
    }

    function removeFromCart() {
        setCount(prev => prev > 1 ? prev - 1 : prev);
    }

    function handleChange(e) {
        const value = e.target.value;
        if(value.toString().includes('.') || value.toString().includes('-')) return;
        
        if(value === '') setCount(1);
        else setCount(value);
    }

    function handleAddToCart() {
        if(!account) navigate('/login', { state: { msg: 'Please login to add items to cart' } });
        else handleAdd({cart_id: cart.cart_id, product_id: product.product_id, quantity: count});
    }

    function getCartCount() {
        const result = cartContents.find(p => p.product_id === product.product_id);
        if(result) return result.quantity;
        else return 0;
    }

    function handleAdd(data) {
        setLoading(true);
        fetch(`${import.meta.env.VITE_BACKEND}/add`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json()).then(data => {
            setCartContents(data.contents);
            notification(data.message);
        }).catch(error => console.error(error))
        .finally(setLoading(false));
    }

    return (
        <div className="product-cart">
            <div className="product-count">
                <button onClick={removeFromCart}>-</button>
                <input type="text" min="1" step="1" value={count} onChange={handleChange}/>
                <button onClick={addToCart}>+</button>
            </div>
            <button onClick={handleAddToCart}>Add To Cart</button>
            {cartContents && getCartCount() > 0 ? 
                <p className="product-current">Currently in cart: {getCartCount()}</p>
                : <p className="product-current"></p>}
        </div>
    );
}