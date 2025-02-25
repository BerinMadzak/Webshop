import { useEffect, useState } from 'react'
import './App.css'
import ProductList from './components/ProductList';
import Filters from './components/Filters';
import Search from './components/Search';

function App() {
  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    const fetchData = async() => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND}/test`);
        if(response.ok) {
          loadProducts("All", "");
          fetch(`${import.meta.env.VITE_BACKEND}/categories`).then(res => res.json()).then(json => setCategories(json));
        } else {
          throw new Error('Failed to load');
        }
      } catch(err) {
        setTimeout(fetchData, 2000);
      }
    };

    fetchData();
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

  if(!products) return <p>Server starting up, please wait</p>

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
