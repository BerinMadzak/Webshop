import { useNavigate } from "react-router-dom";
import AddToCart from "./AddToCart";

export default function Product({product}) {
    const navigate = useNavigate();

    return (
        <div className="product">
            <div className="icon icon-width" onClick={() => navigate(`/product/${product.product_id}`)}>
                {product.discount_amount &&
                    <div className="product-discount">
                        <p>{"-" + product.discount_amount + "%"}</p>
                    </div>
                }
                <img className="product-image" src={product.image_url} alt={product.name}/>
                <p className="product-name">{product.name}</p>
            </div>
            <p className="product-price">{product.discounted_price ? product.discounted_price : product.price}</p>
            {product.discounted_price && <p className="product-price old-price">{product.price}</p>}
            {!product.discounted_price && <p>{" "}</p>}
            <AddToCart product={product}/>
        </div>
    );
}