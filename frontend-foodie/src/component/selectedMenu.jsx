import { useParams } from 'react-router-dom';
import {useAppContext} from '../component/context';
import {menu, order, url} from "../server";
import {useEffect, useState} from "react";
import axios from 'axios';


export const SelectedMenu = () => {
    const {state, dispatch} = useAppContext();
    const {id} = useParams();
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [pack, setPack] = useState('');

    
    useEffect(() => {
        async function getMenu() {
            try {
                const { data } = await axios.get(`${menu}/all`);
                dispatch({ type: 'SET_MENU', payload: data });
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        getMenu()
    }, [dispatch]);

    const selectedMenu = state.menu && state.menu.find(data => data._id === id);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (!selectedMenu) {
        return <div>Menu not found or still loading...</div>;
    }


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
            <div className='res-order-center-det'>
                <h2>{selectedMenu.name}</h2>
                <p>description: {selectedMenu.description}</p>
                <div className='ind'>
                    <span>Price: </span>
                    <span>&#8358;{selectedMenu.price}</span>
                </div>
                <div className='ind'>
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
            {/* <Outlet /> */}
        </div>
     )
}