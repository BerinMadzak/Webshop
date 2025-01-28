import { useContext, useEffect } from "react";
import { ShopContext } from "../main";
import CartProduct from "./CartProduct";
import { useNavigate } from "react-router-dom";

export default function Cart()
{
    const { cartContents, account } = useContext(ShopContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(account === null) navigate('/');
    }, []);

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
                    </tr>
                </thead>
                <tbody>
                    {cartContents &&
                        cartContents.map(product => <CartProduct product={product} key={product.name}/>)
                    }
                </tbody>
            </table>
        </div>
    );
}