import { useContext } from "react";
import { ShopContext } from "../main";
import CartProduct from "./CartProduct";
import { useNavigate } from "react-router-dom";
import Checkout from "./Checkout";

export default function Cart()
{
    const { cartContents, account, cart, setCartContents, setLoading } = useContext(ShopContext);
    const navigate = useNavigate();

    function totalPrice() {
        return cartContents.reduce((accumulator, current) => accumulator + current.total_price, 0);
    }

    function handleDelete(product_id) {
        if(!account) navigate('/login', { state: { msg: 'Please login to view cart' } });
        setLoading(true);
        const data = {
            product_id: product_id,
            quantity: 0,
            cart_id: cart.cart_id
        };
        fetch(`http://localhost:8080/quantity`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json()).then(data => {
            setCartContents(data);
        }).catch(error => console.error(error))
        .finally(setLoading(false));
    }

    function handleReduce(product_id, quantity) {
        if(!account) navigate('/login', { state: { msg: 'Please login to view cart' } });
        setLoading(true);
        const data = {
            product_id: product_id,
            quantity: quantity-1,
            cart_id: cart.cart_id
        };
        fetch(`http://localhost:8080/quantity`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json()).then(data => {
            setCartContents(data);
        }).catch(error => console.error(error))
        .finally(setLoading(false));
    }

    function handleIncrease(product_id, quantity) {
        if(!account) navigate('/login', { state: { msg: 'Please login to view cart' } });
        setLoading(true);
        const data = {
            product_id: product_id,
            quantity: quantity+1,
            cart_id: cart.cart_id
        };
        fetch(`http://localhost:8080/quantity`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json()).then(data => {
            setCartContents(data);
        }).catch(error => console.error(error))
        .finally(setLoading(false));
    }

    const actions = {
        handleDelete,
        handleReduce,
        handleIncrease
    }

    function handleOrder() {
        if(!account) navigate('/login', { state: { msg: 'Please login to view cart' } });
        const price = totalPrice();
        const data = {
            user_id: account.user_id,
            total_price: price,
            products: cartContents,
            cart_id: cart.cart_id
        };
        fetch(`http://localhost:8080/order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json())
        .then(data => {
            console.log(data.message);
            setCartContents(data.contents);
        })
        .catch(error => console.error(error))
        .finally(setLoading(false));
    }

    return (
        <div>
            <button onClick={() => navigate('/')} className="back">Back</button>
            <h1>Cart</h1>
            <table className="cart-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Price</th>
                        <th>Total Price</th>
                        <th className="small-col"></th>
                    </tr>
                </thead>
                <tbody>
                    {cartContents &&
                        cartContents.map(product => <CartProduct product={product} key={product.name} actions={actions}/>)
                    }
                </tbody>
            </table>
            <Checkout total={totalPrice().toFixed(2)} handleOrder={handleOrder} count={cartContents.length}/>
        </div>
    );
}