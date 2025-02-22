import { useNavigate } from "react-router-dom";
import AddToCart from "./AddToCart";
import { useEffect, useState } from "react";

export default function Product({product}) {
    const navigate = useNavigate();

    const [discount, setDiscount] = useState(null);

    function calculatePrice() {
        return discount ? product.price - product.price * (discount.amount/100) : product.price;
    }

    useEffect(() => {
        fetch(`http://localhost:8080/discounts/${product.product_id}`).then(res => res.json()).then(json => setDiscount(json));
    }, []);

    return (
        <div className="product">
            <div className="icon" onClick={() => navigate(`/product/${product.product_id}`)}>
                {discount &&
                    <div className="product-discount">
                        <p>{"-" + discount.amount + "%"}</p>
                    </div>
                }
                <img className="product-image" src={product.image_url} alt={product.name}/>
                <p className="product-name">{product.name}</p>
            </div>
            <p className="product-price">{calculatePrice()}</p>
            {discount && <p className="product-price old-price">{product.price}</p>}
            {!discount && <p>{" "}</p>}
            <AddToCart product={product}/>
        </div>
    );
}