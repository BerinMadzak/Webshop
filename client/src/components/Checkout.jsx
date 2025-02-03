export default function Checkout({total, handleOrder, count}) {
    return (
        <div className="checkout">
            <p className="cart-total">TOTAL: {total}</p>
            <button className="order-button" onClick={handleOrder} disabled={count === 0}>Order</button>
        </div>
    );
}