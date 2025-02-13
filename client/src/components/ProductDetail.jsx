import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../main";
import AddToCart from "./AddToCart";

export default function ProductDetail()
{
    const { productId } = useParams();
    const { setLoading, setCartContents } = useContext(ShopContext);
    const [product, setProduct] = useState();

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:8080/products/${productId}`).then(res => res.json()).then(json => setProduct(json)).finally(setLoading(false));
    }, []);

    if(!product) return "Failed to load product";

    return (
        <div className="product-details">
            <div>
                <img src={product.image_url} alt={product.name} />
            </div>
            <div className="product-details-info">
                <h1>{product.name}</h1>
                <p>{product.description}</p>
                <p className="product-price">{product.price}</p>
                <AddToCart product={product}/>
                SIMILAR PRODUCTS
            </div>
        </div>
    );
}