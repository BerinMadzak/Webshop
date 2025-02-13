import { useNavigate } from "react-router-dom";

export default function SimilarProduct({ product }) {
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(`/product/${product.product_id}`)}>
            <img src={product.image_url} alt={product.name} />
            <p>{product.name}</p>
        </div>
);
}