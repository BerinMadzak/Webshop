import { useContext, useEffect, useState } from 'react'
import './App.css'
import ProductList from './components/ProductList';
import Filters from './components/Filters';
import Header from './components/Header';
import Search from './components/Search';
import { ShopContext } from './main';

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const { setCartContents } = useContext(ShopContext);

  useEffect(() => {
    loadProducts("All", "");
    fetch('http://localhost:8080/categories').then(res => res.json()).then(json => setCategories(json));
  }, []);

  function loadProducts (category, search) {
    fetch(`http://localhost:8080/products?category=${category}&search=${search}`)
      .then(res => res.json()).then(json => setProducts(json));
  }

  const onFiltersChange = (e) => {
    e.preventDefault();
    const category = document.querySelector("#category-select").value;
    const search = document.querySelector("#search-input").value;
    loadProducts(category, search);
  }

  function handleAdd(data) {
    fetch(`http://localhost:8080/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(res => res.json()).then(data => {
      setCartContents(data);
    }).catch(error => console.error(error));
  }

  return (
    <div>
      <Header />
      <Search onFiltersChange={onFiltersChange}/>
      <div className='menu'>
        <Filters categories={categories} onFiltersChange={onFiltersChange}/>
        <ProductList products={products} handleAdd={handleAdd}/>
      </div>
    </div>
  )
}

export default App
