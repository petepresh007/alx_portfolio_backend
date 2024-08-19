import { useAppContext } from "../component/context";
import { order, restaurant, url } from "../server";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";


export const RestaurantOrder = () => {
    const { orderId, id } = useParams();
    const { state } = useAppContext();

    const selectedRestaurant = state.restaurants && state.restaurants.find(data => data._id === id);
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
            alert(`You have successfully placed an order with the id: ${res.data.msg._id}`);
        } catch (error) {
            alert(error.response.data.msg);
        }
    }


    return (
        <div className="res-order">
            <section className="res-order-center">
                <img src={`${url}/upload/${selectedMenu.file}`} alt="" height='200px' width='200px' />
            </section>
            <div>
                <h2>{selectedMenu.name}</h2>
                <p>description: {selectedMenu.description}</p>
                <div>
                    <span>Price: </span>
                    <span>&#8358;{selectedMenu.price}</span>
                </div>
                <div>
                    <span>Total amount: </span>
                    <span>&#8358;{selectedMenu.price * quantity}</span>
                </div>
            </div>
            <form action="" onSubmit={placeAnOrder}>
                <div>
                    <p>address</p>
                    <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="delvey address"
                    />
                </div>
                <div>
                    <p>Payment Method</p>
                    <select
                        name=""
                        id=""
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <option value="">Payment</option>
                        <option value="Card">Card</option>
                        <option value="Cash">Cash</option>
                        <option value="Online">Online</option>
                    </select>
                </div>

                <div>
                    <p>Pack</p>
                    <select
                        name=""
                        id=""
                        value={pack}
                        onChange={(e) => setPack(e.target.value)}
                    >
                        <option value="">pack</option>
                        <option value="Big Pack">Big Pack</option>
                        <option value="Branded Pack">Branded Pack</option>
                    </select>
                </div>
                <div>
                    <p>Quantity</p>
                    <input
                        type="number"
                        placeholder="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </div>
                <button>Place order</button>
            </form>
            <Outlet />
        </div>
    )
}