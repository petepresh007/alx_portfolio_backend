import { useAppContext } from "../component/context";
import { order, restaurant, url } from "../server";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";


export const RestaurantOrder = () => {
    const { orderId, id } = useParams();
    const { state, dispatch } = useAppContext();

    const selectedRestaurant = state.restaurants && state.restaurants.find(data => data._id === id);
    
    if(selectedRestaurant.menu.length <= 0){
        return <div>
            No menu present
        </div>
    }
    const selectedMenu = selectedRestaurant.menu.find(menuItem => menuItem._id === orderId);

    const [quantity, setQuantity] = useState(1);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [pack, setPack] = useState('');


    async function placeAnOrder(e) {
        e.preventDefault();
        
        try {
            const data = {
                items: [
                    {
                        menuItem: selectedMenu._id,
                        price: selectedMenu.price
                    }
                ],
                restaurant: selectedMenu.restaurant,
                quantity,
                totalAmount: (selectedMenu.price * quantity),
                deliveryAddress,
                paymentMethod,
                pack
            }
            const res = await axios.post(`${order}/place-order`, data, {
                withCredentials: true
            });
            dispatch({ type: 'SET_CART', payload: res.data.data });
            alert(`You have successfully placed an order with the id: ${res.data.msg._id}`);
        } catch (error) {
            alert(error.response.data.msg);
        }
    }


    return (
        <div className='w-full flex justify-center'>

            <div className="res-order bg-gray-200 pb-4 rounded-md min-w-[290px] max-w-[500px] ">
                <section className="w-[100%] flex justify-center rounded-md rounded-b-none">
                    <img className='rounded-[inherit] w-[full]' src={`${url}/upload/${selectedMenu.file}`} alt={`picture of ${selectedMenu.name}`} />
                </section>
                    <div  className='bg-orange-500 text-white p-1 rounded-t-md mt-4'>
                        <h2 className='text-center capitalize font-semibold '>{selectedMenu.name}</h2>
                        <p  className='text-sm font-medium text-center '><em>{selectedMenu.description}</em></p>
                    </div>
                <div className=' mt-4 p-2'>
                    <div className='ind bg-gray-200'>
                        <span className='font-semibold'>Price: </span>
                        <span>&#8358;{selectedMenu.price}</span>
                    </div>
                    <div className='ind'>
                        <span className='font-semibold'>Total amount: </span>
                        <span>&#8358;{selectedMenu.price * quantity}</span>
                    </div>
                </div>
                <form 
                    className='px-2'
                    action="" onSubmit={placeAnOrder}>
                    <div>
                        <label className='font-semibold' htmlFor='address'>Address</label>
                        <input
                            className='font-medium rounded-md'
                            id='address'
                            type="text"
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            placeholder="delivery address"
                            required
                        />
                    </div>
                    <div>
                        <label className='font-semibold' htmlFor='payMethod'>Payment Method</label>
                        <select
                            className='font-medium rounded-md'
                            name=""
                            id="payMethod"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            aria-label='choose method of payment'
                            required
                        >
                            <option value="">Payment Options</option>
                            <option value="Card">Card</option>
                            <option value="Cash">Cash</option>
                            <option value="Online">Online</option>
                        </select>
                    </div>

                    <div>
                        <label className='font-semibold' htmlFor='packSize'>Pack Size</label>
                        <select
                            className='font-medium rounded-md'
                            name=""
                            id="packSize"
                            value={pack}
                            onChange={(e) => setPack(e.target.value)}
                            aria-label='choose pack size'
                            required
                        >
                            <option value="">Select Pack</option>
                            <option value="Big Pack">Big Pack</option>
                            <option value="Branded Pack">Branded Pack</option>
                        </select>
                    </div>
                    <div>
                        <label className='font-semibold' htmlFor='quantity'>Quantity</label>
                        <input
                            aria-label='select quantity'
                            className='rounded-md font-medium'
                            type="number"
                            placeholder="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                        />
                    </div>
                    <button className='rounded-md'>Place order</button>
                </form>
                {/* <Outlet /> */}
            </div>
        </div>
    )
}