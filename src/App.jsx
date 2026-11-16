import { Route, Routes } from 'react-router-dom';
import { Cart } from './pages/Cart.jsx';
import { Checkout } from './pages/Checkout.jsx';
import { Confirmation } from './pages/Confirmation.jsx';
import { Home } from './pages/Home.jsx';
import { ItemDetails } from './pages/ItemDetails.jsx';
import { NotFound } from './pages/NotFound.jsx';
import { Shop } from './pages/Shop.jsx';

export default function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/items/:id" element={<ItemDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
}
