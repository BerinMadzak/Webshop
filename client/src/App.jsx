import { useEffect, useState } from 'react'
import './App.css'
import ProductList from './components/ProductList';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/products').then(res => res.json()).then(json => setProducts(json));
  }, []);

  return (
    <>
      <ProductList products={products}/>
    </>
  )
}

export default App
