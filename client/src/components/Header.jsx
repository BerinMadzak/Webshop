import { useContext } from "react";
import { ShopContext } from "../main";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const { account, setAccount } = useContext(ShopContext);
    const naviagte = useNavigate();

    function handleSignOut() {
        setAccount(null);
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
                    <p>{account.username}</p>
                    <button onClick={handleSignOut}>Sign Out</button>
                </div>
            }
            {account &&            
                <div className="cart-container">
                    <i className="cart-icon fa-solid fa-cart-shopping"></i>
                    <p className="cart-count">0</p>
                </div>
            }
        </div>
    );
}