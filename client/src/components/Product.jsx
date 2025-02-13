import { useNavigate } from "react-router-dom";
import AddToCart from "./AddToCart";

export default function Product({product}) {
    const navigate = useNavigate();

    return (
        <div className="product">
            <div className="icon" onClick={() => navigate(`/product/${product.product_id}`)}>
                <img className="product-image" src={product.image_url} alt={product.name}/>
                <p className="product-name">{product.name}</p>
            </div>
            <p className="product-price">{product.price}</p>
            <AddToCart product={product}/>
        </div>
    );
}