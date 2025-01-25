import { createContext, StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "signup",
    element: <Signup />
  },
  {
    path: "login",
    element: <Login />
  },
  {
    path: '*',
    element: <App />
  }
]);

export const ShopContext = createContext(null);

const Main = () => {
  const [account, setAccount] = useState(null);

  return (
    <StrictMode>
      <ShopContext.Provider value={{ account, setAccount }}>
        <RouterProvider router={router} />
      </ShopContext.Provider>
    </StrictMode>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<Main />);
