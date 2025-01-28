export default function CartProduct({ product })
{
    return (
        <tr className="cart-product">
            <td>
                <img className="cart-product-image" src={product.image_url} alt={product.name}/>
            </td>
            <td>
                <p className="cart-product-name">{product.name}</p> 
            </td>
            <td>
                <p>{product.quantity}</p>
            </td>
            <td>
                <p className="product-price">{product.total_price}</p>
            </td>
        </tr>
    );
}