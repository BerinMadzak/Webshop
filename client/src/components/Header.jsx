import { useContext } from "react";
import { ShopContext } from "../main";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const { account, setAccount, setCart, cartContents, setCartContents } = useContext(ShopContext);
    const naviagte = useNavigate();

    function handleSignOut() {
        setAccount(null);
        setCart(null);
        setCartContents(null);
    }

    function cartContentCount() {
        let count = 0;
        console.log(cartContents);
        for(let i = 0; i < cartContents.length; i++) {
            count += cartContents[i].quantity;
        }
        return count;
    }

    return (
        <div className="header">
            {!account && 
                <div className="flex-gap">
                    <button onClick={() => naviagte('/login')}>Login</button>
                    <button onClick={() => naviagte('/signup')}>Register</button>
                </div>
            }
            {account &&
                <div className="flex-gap">
                    <p>Welcome, {account.username}</p>
                    <button onClick={handleSignOut}>Sign Out</button>
                </div>
            }
            {account &&            
                <div className="cart-container" onClick={() => naviagte('/cart')}>
                    <i className="cart-icon fa-solid fa-cart-shopping"></i>
                    <p className="cart-count">{cartContentCount()}</p>
                </div>
            }
        </div>
    );
}