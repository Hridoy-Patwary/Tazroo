import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Product from './pages/Product';
import Cart from './pages/Cart';
import User from './pages/User';
import Header from './components/Header'; // Import the Header component

function App() {
  document.title = "Tazroo - Get Fast";
  
  return (
    <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/product' element={<Product />} />
          <Route path='/account' element={<User />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;