import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../main";
import Order from "./Order";

export default function OrderList() {
    const [orders, setOrders] = useState(null);
    
    const { account, setLoading } = useContext(ShopContext);    

    useEffect(() => {
        if(!account) return;

        setLoading(true);
        fetch(`http://localhost:8080/orders/${account.user_id}`)
        .then(res => res.json())
        .then(json => setOrders(json))
        .catch(err => console.log(err))
        .finally(setLoading(false));
    }, []);

    return (
        <div>
            <h1>Past Orders</h1>
            {orders &&
                orders.map(order => <Order order={order} key={order.order_id} />)
            }
        </div>
    );
}