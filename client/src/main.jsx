import { createContext, StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';
import Cart from './components/Cart.jsx';
import Cookies from 'js-cookie';

export const ShopContext = createContext(null);

const Main = () => {
  const [account, setAccount] = useState(null);
  const [cart, setCart] = useState(null);
  const [cartContents, setCartContents] = useState(null);
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />
    },
    {
      path: "signup",
      element: account === null ? <Signup /> : <Navigate to="/" />
    },
    {
      path: "login",
      element: account === null ? <Login /> : <Navigate to="/" />
    },
    {
      path: "cart",
      element: account !== null ? <Cart /> : <Navigate to="/" />
    },
    {
      path: '*',
      element: <App />
    }
  ]);

  useEffect(() => {
    const cookie = Cookies.get('user-data');
    if(cookie) {
      const data = JSON.parse(Cookies.get('user-data'));
      setAccount(data.user);
      setCart(data.cart);
      setCartContents(data.contents);
    }
  }, []);

  return (
    <StrictMode>
      <ShopContext.Provider value={{ account, setAccount, cart, setCart, cartContents, setCartContents }}>
        <RouterProvider router={router} />
      </ShopContext.Provider>
    </StrictMode>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<Main />);
