import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../main";
import Order from "./Order";
import { useNavigate } from "react-router-dom";

export default function OrderList() {
    const [orders, setOrders] = useState(null);
    
    const { account, setLoading } = useContext(ShopContext);    

    const navigate = useNavigate();

    useEffect(() => {
        if(!account) return;

        setLoading(true);
        fetch(`${import.meta.env.VITE_BACKEND}/orders/${account.user_id}`)
        .then(res => res.json())
        .then(json => setOrders(json))
        .catch(err => console.log(err))
        .finally(setLoading(false));
    }, []);

    function openDetails(order_id) {
        navigate(`/orders/${order_id}`);
    }

    return (
        <div>
            <h1>Past Orders</h1>
            {orders &&
                orders.map(order => <Order order={order} key={order.order_id} openDetails={openDetails}/>)
            }
            {orders && orders.length === 0 && <p className="">No previous orders</p>}
        </div>
    );
}