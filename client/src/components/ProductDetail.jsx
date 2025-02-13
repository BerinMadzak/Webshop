import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../main";
import AddToCart from "./AddToCart";
import SimilarProduct from "./SimilarProduct";

export default function ProductDetail()
{
    const { productId } = useParams();
    const { setLoading } = useContext(ShopContext);
    const [product, setProduct] = useState();
    const [ similarProducts, setSimilarProducts ] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:8080/products/${productId}`)
            .then(res => res.json())
            .then(json => {
                setProduct(json);
                fetch(`http://localhost:8080/products/c/${json.category_id}`)
                    .then(res2 => res2.json())
                    .then(json2 => {
                        const arr = [];
                        const count = json2.length > 3 ? 3 : json2.length;
                        for(let i = 0; i < count; i++) {
                            let p = null;
                            do {
                                const num = Math.floor(Math.random() * json2.length);
                                p = json2[num];
                            } while(arr.includes(p) || p.product_id === json.product_id);
                            arr.push(p);
                        }
                        setSimilarProducts(arr);
                    });
            })
            .finally(setLoading(false));
    }, [productId]);

    if(!product) return "Failed to load product";

    return (
        <div>
            <div className="product-details">
                <div>
                    <img src={product.image_url} alt={product.name} />
                </div>
                <div className="product-details-info">
                    <h1>{product.name}</h1>
                    <p>{product.description}</p>
                    <p className="product-price">{product.price}</p>
                    <AddToCart product={product}/>
                </div>
            </div>
            <div className="similar-products-container">
                <h2>Similar Products</h2>
                {similarProducts &&
                    <div className="similar-products flex-gap center">
                        {similarProducts.length > 0 && 
                            <SimilarProduct product={similarProducts[0]}/>
                        }
                        {similarProducts.length > 1 && 
                            <SimilarProduct product={similarProducts[1]}/>
                        }
                        {similarProducts.length > 2 && 
                            <SimilarProduct product={similarProducts[2]}/>
                        }
                    </div>
                }
            </div>
        </div>
    );
}