import { Home } from './pages/Home';
import { Order } from './pages/Order';
import { Restaurant } from './pages/Restaurant';
import { Menu } from './pages/Menu';
import { SelectedRestaurant } from './component/selectrestaurant';
import { AllMenuRes } from './component/allmenu';
import { RestaurantOrder } from './component/order';
import { Login } from './pages/login';
import { Nav } from "./component/nav";
import { Cart } from "./component/cart";
import { Pay } from "./component/payment";


import { AppProvider } from "./component/context";
import { useNavigate } from "react-router-dom";

import { Route, Routes, Link } from "react-router-dom";

function App() {
  const go = useNavigate();

  return (
    <>
      <AppProvider>
        <div className='container'>
          <Nav />

          <section className="body">
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/orders' element={<Order />} />
              <Route path='/restaurant' element={<Restaurant />} />
              <Route path='/menu' element={<Menu />} />
              <Route path='/selected-res/:id' element={<SelectedRestaurant />}>
                {/* <Route path='' element={<AllMenuRes />}>
                  <Route path='order/:orderId' element={<RestaurantOrder />} />
                </Route> */}
                <Route index element={<AllMenuRes />} />
                <Route path='order/:orderId' element={<RestaurantOrder />} />
              </Route>
              <Route path='/login' element={<Login />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/payus/:id' element={<Pay />} />
            </Routes>
          </section>

        </div>
      </AppProvider>
    </>
  )
}

export default App