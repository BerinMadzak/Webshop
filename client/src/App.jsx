import { useEffect } from 'react'
import './App.css'

function App() {
  useEffect(() => {
    fetch('http://localhost:8080/api').then(res => res.json()).then(json => console.log(json));
  }, []);

  return (
    <>
      
    </>
  )
}

export default App
