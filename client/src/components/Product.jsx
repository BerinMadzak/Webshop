export default function Product({product}) {
    return (
        <div className="product">
            <img className="product-image" src={product.image_url} alt={product.name}/>
            <p className="product-name">{product.name}</p>
            <p className="product-price">{product.price}</p>
        </div>
    );
}