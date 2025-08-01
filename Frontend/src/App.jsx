import React from 'react'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import { use } from 'react'








const App = () => {

 const [data, setData] = useState(null)

useEffect(() => {
  fetch ('/api/data') // vite จะ proxy ไปยัง http://localhost:5000/api/data
  .then(res => res.json())
  .then(info =>  setData(info))
  .catch(err => console.error('Error fetching data:', err))
}, []);

  return (
    <div>
      <Navbar />
      <div className= "px-6 md:px-12 lg:px-24 xl:px-32">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
