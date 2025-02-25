import { useEffect, useState } from 'react'
import './App.css'
import ProductList from './components/ProductList';
import Filters from './components/Filters';
import Search from './components/Search';

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadProducts("All", "");
    fetch(`${import.meta.env.VITE_BACKEND}/categories`).then(res => res.json()).then(json => setCategories(json));
  }, []);

  function loadProducts (category, search) {
    fetch(`${import.meta.env.VITE_BACKEND}/products?category=${category}&search=${search}`)
      .then(res => res.json()).then(json => setProducts(json));
  }

  const onFiltersChange = (e) => {
    e.preventDefault();
    const category = document.querySelector("#category-select").value;
    const search = document.querySelector("#search-input").value;
    loadProducts(category, search);
  }

  return (
    <div>
      <Search onFiltersChange={onFiltersChange}/>
      <div className='menu'>
        <Filters categories={categories} onFiltersChange={onFiltersChange}/>
        <ProductList products={products} />
      </div>
    </div>
  )
}

export default App
