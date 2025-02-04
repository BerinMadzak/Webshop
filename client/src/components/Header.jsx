import { useContext } from "react";
import { ShopContext } from "../main";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const { account, setAccount, setCart, cartContents, setCartContents } = useContext(ShopContext);
    const navigate = useNavigate();

    function handleSignOut() {
        fetch('http://localhost:8080/logout', {
            method: 'POST',
            credentials: 'include'
        });
        setAccount(null);
        setCart(null);
        setCartContents(null);
    }

    function cartContentCount() {
        let count = 0;
        for(let i = 0; i < cartContents.length; i++) {
            count += cartContents[i].quantity;
        }
        return count;
    }

    return (
        <div className="header">
            {!account && 
                <div className="flex-gap">
                    <button onClick={() => navigate('/login')}>Login</button>
                    <button onClick={() => navigate('/signup')}>Register</button>
                </div>
            }
            {account &&
                <div className="flex-gap">
                    <p>Welcome, {account.username}</p>
                    <button onClick={handleSignOut}>Sign Out</button>
                </div>
            }
            {account &&            
                <div className="flex-gap">
                    {account.admin && <i className="icon fa-solid fa-wrench" onClick={() => navigate('/admin')}></i>}
                    <i className="icon fa-solid fa-user" onClick={() => navigate('/account')}></i>
                    <i className="icon fa-solid fa-clipboard" onClick={() => navigate('/orders')}></i>
                    <div className="cart-container" onClick={() => navigate('/cart')}>
                        <i className="icon fa-solid fa-cart-shopping"></i>
                        <p className="cart-count">{cartContentCount()}</p>
                    </div>
                </div>
            }
        </div>
    );
}