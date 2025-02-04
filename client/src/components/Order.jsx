export default function Order({order, openDetails}) {
    return (
        <div className="order" onClick={() => openDetails(order.order_id)}>
            <p>#{order.order_id}</p>
            <p>{order.total_quantity} Items</p>
            <p className="product-price">{order.total_price}</p>
            <p className="order-date">{order.order_date}</p>
        </div>
    );
}