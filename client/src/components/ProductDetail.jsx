import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../main";

export default function ProductDetail()
{
    const [count, setCount] = useState(1);
    const { productId } = useParams();
    const { setLoading, cartContents, account, cart, setCartContents } = useContext(ShopContext);
    const [product, setProduct] = useState();

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:8080/products/${productId}`).then(res => res.json()).then(json => setProduct(json)).finally(setLoading(false));
    }, []);

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
        handleAdd({cart_id: cart.cart_id, product_id: product.product_id, quantity: count});
    }

    function getCartCount() {
        const result = cartContents.find(p => p.product_id === product.product_id);
        if(result) return result.quantity;
        else return 0;
    }

    // Copied from App.jsx, remove eventually
    function handleAdd(data) {
        setLoading(true);
        fetch(`http://localhost:8080/add`, {
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

    if(!product) return "Failed to load product";

    return (
        <div className="product-details">
            <div>
                <img src={product.image_url} alt={product.name} />
            </div>
            <div className="product-details-info">
                <h1>{product.name}</h1>
                <p>{product.description}</p>
                <p className="product-price">{product.price}</p>
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
            </div>
        </div>
    );
}