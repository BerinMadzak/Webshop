import { useEffect, useState } from 'react'
import './App.css'
import ProductList from './components/ProductList';
import Filters from './components/Filters';

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadProducts("All");
    fetch('http://localhost:8080/categories').then(res => res.json()).then(json => setCategories(json));
  }, []);

  function loadProducts (category) {
    fetch(`http://localhost:8080/products?category=${category}`).then(res => res.json()).then(json => setProducts(json));
  }

  const onFiltersChange = (e) => {
    loadProducts(e.target.value);
  }

  return (
    <div className='menu'>
      <Filters categories={categories} onFiltersChange={onFiltersChange}/>
      <ProductList products={products}/>
    </div>
  )
}

export default App
