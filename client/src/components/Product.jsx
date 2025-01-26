import { useContext, useState } from "react";
import { ShopContext } from "../main";
import { useNavigate } from "react-router-dom";

export default function Product({product}) {
    const [count, setCount] = useState(0);
    const { account } = useContext(ShopContext);
    const navigate = useNavigate();

    function addToCart() {
        setCount(prev => prev + 1);
    }

    function removeFromCart() {
        setCount(prev => prev > 0 ? prev - 1 : prev);
    }

    function handleChange(e) {
        const value = e.target.value;
        if(value.toString().includes('.') || value.toString().includes('-')) return;
        
        if(value === '') setCount(0);
        else setCount(value);
    }

    function handleAdd() {
        if(!account) navigate('/login', { state: { msg: 'Please login to add items to cart' } });
    }

    return (
        <div className="product">
            <img className="product-image" src={product.image_url} alt={product.name}/>
            <p className="product-name">{product.name}</p>
            <p className="product-price">{product.price}</p>
            <div className="product-cart">
                <div className="product-count">
                    <button onClick={removeFromCart}>-</button>
                    <input type="text" min="0" step="1" value={count} onChange={handleChange}/>
                    <button onClick={addToCart}>+</button>
                </div>
                <button onClick={handleAdd}>Add To Cart</button>
                <p className="product-current">Currently in cart: 0</p>
            </div>
        </div>
    );
}