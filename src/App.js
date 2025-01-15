import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Product from './pages/Product';
import Cart from './pages/Cart';
import User from './pages/User';
import Header from './components/Header';
import Admin from './pages/Admin';
import { useState } from 'react';
import AdminLogin from './pages/AdminLogin';

function App() {
  const [header, setHeader] = useState(true);


  const setHeaderVisibility = (visible) => {
    setHeader(visible);
  }

  return (
    <BrowserRouter>
        {header && <Header />}
        <Routes>
          <Route path='/' element={<Home hdr={setHeaderVisibility} />} />
          <Route path='/cart' element={<Cart hdr={setHeaderVisibility} />} />
          <Route path='/product' element={<Product hdr={setHeaderVisibility} />} />
          <Route path='/account' element={<User hdr={setHeaderVisibility} />} />
          <Route path='/admin' element={<Admin hdr={setHeaderVisibility} />} />
          <Route path='/admin/login' element={<AdminLogin hdr={setHeaderVisibility} />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;