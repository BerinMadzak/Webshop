import { useContext, useState } from "react";
import Order from "./Order";
import { ShopContext } from "../main";
import { useNavigate } from "react-router-dom";

export default function FindOrder() {
    const [type, setType] = useState('ID');
    const [orders, setOrders] = useState(null);
    const [error, setError] = useState("");

    const { setLoading } = useContext(ShopContext);

    const navigate = useNavigate();

    function handleChange(e) {
        setType(e.target.value);
    }

    function openDetails(order_id) {
        navigate(`/orders/${order_id}`);
    }


    function handleSearch() {
        const search = document.getElementById("search").value;
        setError('');
        setOrders(null);

        setLoading(true);
        if(type === "User") {
            fetch(`http://localhost:8080/userid/${search}`)
            .then(res => res.json())
            .then(json => {
                if(json.user_id) {
                    fetch(`http://localhost:8080/orders/${json.user_id}`)
                    .then(res => res.json())
                    .then(json2 => setOrders(json2))
                    .catch(err => console.log(err));
                } else {
                    setError(json.message);
                }
            })
            .finally(setLoading(false));
        } else if(type === "ID") {
            fetch(`http://localhost:8080/order/c/${search}`)
            .then(res => res.json())
            .then(json => {
                if(!json.message) setOrders(json)
                else setError(json.message);
            })
            .catch(err => console.log(err))
            .finally(setLoading(false));
        }
    }

    return (
        <div>
            <p>Find orders by:</p>
            <div className="flex-gap center">
                <select onChange={handleChange}>
                    <option>ID</option>
                    <option>User</option>
                </select>
                <input id="search" type="text" placeholder={type === 'ID' ? 'Enter order ID' : 'Enter username'} />
                <button onClick={handleSearch}>Search</button>
            </div>
            {orders &&
                orders.map(order => <Order order={order} key={order.order_id} openDetails={openDetails}/>)
            }
            <p>{error}</p>
        </div>
    );
}