import { useContext } from "react";
import { ShopContext } from "../main";
import CartProduct from "./CartProduct";

export default function Cart()
{
    const { cartContents } = useContext(ShopContext);

    return (
        <div>
            <table className="cart-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Total Price</th>
                    </tr>
                </thead>
                <tbody>
                    {cartContents &&
                        cartContents.map(product => <CartProduct product={product} key={product.name}/>)
                    }
                </tbody>
            </table>
        </div>
    );
}