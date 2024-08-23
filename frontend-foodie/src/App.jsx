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
import { Register } from './pages/register';
import { SelectedMenu } from './component/selectedMenu';
import { Profile } from './pages/profile';
import { Message } from './component/message';
import { OrderDelivered } from './component/userOrder';
import { Rice } from './pages/rice';
import { Beans } from './pages/beans';
import { Swallow } from './pages/swallow';
import { ManageAccount } from './pages/manageaccount';
import { EditUsername } from './component/username';
import { EditPhoneNumber } from './pages/phoneNumber';
import { ChangePassword } from './component/changepassword';
import { Search } from './component/search';
import { LoginAdmin } from './component/admin/login';
import { Admin } from './component/admin/admindashboard';
import { AdminHome } from './component/admin/home';
import { ManageUsers } from './component/admin/manageusers';
import { ManageRestaurants } from './component/admin/managerestaurant';
import {CreateRestaurant} from './component/admin/createrestaurant';
import {CreateMenu} from './component/admin/createmenu';
import {UpdateRestaurant} from './component/admin/updaterestaurant';


import { AppProvider } from "./component/context";
import { useNavigate } from "react-router-dom";

import { Route, Routes, Link } from "react-router-dom";

function App() {
  const go = useNavigate();

  return (
    <>
      <AppProvider>
        <div className=''>
          <Nav />

          <section className="body">
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/orders' element={<Order />} />
              <Route path='/restaurant' element={<Restaurant />} />
              <Route path='/menu' element={<Menu />} />
              <Route path='/selected-res/:id' element={<SelectedRestaurant />}>
                <Route index element={<AllMenuRes />} />
                <Route path='rice' element={<Rice />} />
                <Route path='beans' element={<Beans />} />
                <Route path='swallow' element={<Swallow />} />
                <Route path='order/:orderId' element={<RestaurantOrder />} />
              </Route>
              <Route path='/login' element={<Login />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/payus/:id' element={<Pay />} />
              <Route path='/register' element={<Register />} />
              <Route path='/selected-menu/:id' element={<SelectedMenu />} />

              <Route path='/profile' element={<Profile />}></Route>
              <Route path='/profile/inbox' element={<Message />} />
              <Route path='/profile/order' element={<OrderDelivered />} />
              <Route path='/profile/manageaccount' element={<ManageAccount />} />
              <Route path='/profile/editusername' element={<EditUsername />} />
              <Route path='/profile/editphonenumber' element={<EditPhoneNumber />} />
              <Route path='/profile/changepassword' element={<ChangePassword />} />
              <Route path='/search' element={<Search />} />
              <Route path='/loginadmin' element={<LoginAdmin />} />

              <Route path='/admin' element={<Admin />}>
                <Route index element={<AdminHome />} />
                <Route path='manageusers' element={<ManageUsers />} />
                <Route path='manageres' element={<ManageRestaurants />} />
                <Route path='manageres/createres' element={<CreateRestaurant/>} />
                <Route path='manageres/createresmenu/:id' element={<CreateMenu />} />
                <Route path='manageres/updateres/:id' element={<UpdateRestaurant />} />
              </Route>
            </Routes>
          </section>

        </div>
      </AppProvider>
    </>
  )
}

export default App