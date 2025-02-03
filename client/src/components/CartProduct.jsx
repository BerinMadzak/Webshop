export default function CartProduct({ product, actions })
{
    function handleIncrease() {

    }

    function handleReduce() {

    }

    return (
        <tr className="cart-product">
            <td>
                <img className="cart-product-image" src={product.image_url} alt={product.name}/>
            </td>
            <td>
                <p className="cart-product-name">{product.name}</p> 
            </td>
            <td>
                <div className="cart-product-count">
                    <i className="fa-solid fa-minus" onClick={handleReduce}></i>
                    <p>{product.quantity}</p>
                    <i className="fa-solid fa-plus" onClick={handleIncrease}></i>
                </div>
            </td>
            <td>
                <p className="product-price">{product.total_price}</p>
            </td>
            <td className="small-col">
                <i className="fa-solid fa-trash" onClick={() => actions.handleDelete(product.product_id)}></i>
            </td>
        </tr>
    );
}