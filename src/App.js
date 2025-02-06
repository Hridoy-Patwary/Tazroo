import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Cart from './pages/Cart';
import User from './pages/User';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Product from './pages/Product';
import Profile from './pages/Profile';
import Services from './pages/Services'
import Header from './components/Header';
import AdminLogin from './pages/AdminLogin';
import Feedback from './pages/small/Feedback';


function App() {
  const [header, setHeader] = useState(true);
  const [products, setProducts] = useState([]);
  
  const setHeaderVisibility = (visible) => {
    setHeader(visible);
  }

  useEffect(() => {
      const footer = document.querySelector('.footer-container');

      if(footer){
        const footerBoundingRect = footer.getBoundingClientRect();
        document.body.style.paddingBottom = footerBoundingRect.height + 'px';
      }

      fetch(process.env.REACT_APP_API_URL + '/api/v1/product-list')
          .then((res) => res.json())
          .then((data) => setProducts(data)).catch((error) => {
              console.error('Error fetching data: ', error);
          });
  }, []);

  return (
    <BrowserRouter>
        {header && <Header prList={products} />}
        <Routes>
          <Route path='/' element={<Home prList={products} hdr={setHeaderVisibility} />} />
          <Route path='/cart' element={<Cart hdr={setHeaderVisibility} />} />
          <Route path='/product/:id' element={<Product prList={products} hdr={setHeaderVisibility} />} />
          <Route path='/services' element={<Services hdr={setHeaderVisibility} />} />
          <Route path='/account' element={<User hdr={setHeaderVisibility} />} />
          <Route path='/profile' element={<Profile hdr={setHeaderVisibility} />} />
          <Route path='/admin' element={<Admin hdr={setHeaderVisibility} />} />
          <Route path='/admin/login' element={<AdminLogin hdr={setHeaderVisibility} />} />

          <Route path='/feedback' element={<Feedback />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;