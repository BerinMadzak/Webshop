import { createContext, StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';
import Cart from './components/Cart.jsx';
import Loading from './components/Loading.jsx';
import OrderList from './components/OrderList.jsx';
import OrderDetails from './components/OrderDetails.jsx';
import Account from './components/Account.jsx';
import Admin from './components/Admin.jsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout.jsx';
import AddProduct from './components/AddProduct.jsx';

export const ShopContext = createContext(null);

const Main = () => {
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(null);
  const [cart, setCart] = useState(null);
  const [cartContents, setCartContents] = useState(null);
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
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
          path: "orders",
          element: account !== null ? <OrderList /> : <Navigate to="/" />
        },
        {
          path: "orders/:orderId",
          element: account !== null ? <OrderDetails /> : <Navigate to="/" />
        },
        {
          path: "account",
          element: account !== null ? <Account /> : <Navigate to="/" />
        },
        {
          path: "admin",
          element: account !== null && account.admin ? <Outlet /> : <Navigate to="/" />,
          children: [
            {
              path: "/admin",
              element: <Admin />
            },
            {
              path: "account",
              element: <AddProduct />
            }
          ]
        }
      ]
    },
    {
      path: '*',
      element: <Layout />
    }
  ]);

  useEffect(() => {
    fetch('http://localhost:8080/account', {
      credentials: 'include'
    }).then(res => {
      if(res.ok) return res.json();
      else throw new Error("No token");
    })
    .then(data => {
      setAccount(data.user);
      setCart(data.cart);
      setCartContents(data.contents);
    }).catch(err => console.log(err));
  }, []);

  function notification(message) {
    toast(<div dangerouslySetInnerHTML={{ __html: message}}></div>);
  }

  return (
    <StrictMode>
      <ShopContext.Provider value={{ account, setAccount, cart, setCart, cartContents, setCartContents, setLoading, notification }}>
        <ToastContainer 
          position='top-right'
          autoClose={2000}
          hideProgressBar
          newestOnTop
          closeButton
          style={{ top: '70px' }}
        />
        <Loading loading={loading}/>
        <RouterProvider router={router} />
      </ShopContext.Provider>
    </StrictMode>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<Main />);
