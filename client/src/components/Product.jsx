export default function Product({product}) {
    return (
        <div>
            <img src={product.image_url} alt={product.name}/>
            <p>{product.name}</p>
            <p>{product.price}</p>
        </div>
    );
}