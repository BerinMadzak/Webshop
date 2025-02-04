export default function Order({order}) {
    return (
        <div className="order">
            <p>{order.total_quantity} Items</p>
            <p className="product-price">{order.total_price}</p>
            <p className="order-date">{order.order_date}</p>
        </div>
    );
}