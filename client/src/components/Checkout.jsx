export default function Checkout({total}) {
    return (
        <div className="checkout">
            <p className="cart-total">TOTAL: {total}</p>
            <button className="order-button">Order</button>
        </div>
    );
}