import { useContext } from "react";
import { ShopContext } from "../main";
import CartProduct from "./CartProduct";
import { useNavigate } from "react-router-dom";

export default function Cart()
{
    const { cartContents, account, cart, setCartContents, setLoading } = useContext(ShopContext);
    const navigate = useNavigate();

    function handleDelete(product_id) {
        if(!account) navigate('/login', { state: { msg: 'Please login to remove items to cart' } });
        setLoading(true);
        const data = {
            product_id: product_id,
            quantity: -1,
            cart_id: cart.cart_id
        };
        fetch(`http://localhost:8080/remove`, {
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
        handleDelete
    }

    return (
        <div>
            <button onClick={() => navigate('/')} className="cart-back">Back</button>
            <h1>Cart</h1>
            <table className="cart-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Amount</th>
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
        </div>
    );
}