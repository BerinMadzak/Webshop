import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ShopContext } from "../main";
import OrderProduct from "./OrderProduct";

export default function OrderDetails() {
    const [order, setOrder] = useState(null);
    
    const { orderId } = useParams();
    const { account, setLoading } = useContext(ShopContext);

    const navigate = useNavigate();
    
    function totalPrice() {
        return order.reduce((accumulator, current) => accumulator + current.total_price, 0);
    }

    useEffect(() => {
        if(!account) return;

        setLoading(true);
        fetch(`http://localhost:8080/order/${orderId}`)
        .then(res => res.json())
        .then(json => setOrder(json))
        .catch(err => console.log(err))
        .finally(setLoading(false));
    }, [orderId]);

    return (
        <div>
            <button onClick={() => navigate('/orders')} className="back">Back</button>
            <h1>Order #{orderId}</h1>
            <table className="cart-table">
            <thead>
                <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Price</th>
                    <th>Total Price</th>
                </tr>
            </thead>
            <tbody>
            {order &&
                order.map(product => <OrderProduct product={product} key={product.product_id}/>)
            }
            </tbody>
            <tfoot>
                <tr>
                    {order && <td colSpan={5}><p className="product-price">Total: {totalPrice()}</p></td>}
                </tr>
            </tfoot>
            </table>
        </div>
    );
}