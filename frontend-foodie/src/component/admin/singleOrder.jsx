import { useParams } from 'react-router-dom';
import { useAppContext } from '../context';
import { useEffect } from 'react';
import { order, url } from '../../server';
import axios from 'axios';



export const SingleOrder = () => {
    const { id } = useParams();
    const { state, dispatch } = useAppContext();

    //confirm order
    async function confirmOrder(id){
        try {
            const { data } = await axios.put(`${order}/approver-user-order/${id}`);
            alert(data.msg);
            dispatch({ type: 'SET_ADMIN_ORDER', payload: data.data });
        } catch (error) {
            alert(error.response.data.msg);
        }
    }

    //confirm delivery
    async function confirmDelivery(id) {
        try {
            const { data } = await axios.put(`${order}/delivered/${id}`);
            alert(data.msg);
            dispatch({ type: 'SET_ADMIN_ORDER', payload: data.data });
        } catch (error) {
            alert(error.response.data.msg);
        }
    }


    useEffect(() => {
        async function getOrders() {
            try {
                const { data } = await axios.get(`${order}/all`);
                dispatch({ type: 'SET_ADMIN_ORDER', payload: data });
            } catch (error) {
                console.log(error)
            }
        }
        getOrders()
    }, [dispatch]);

    const choiceOrder = state.adminGetOrders && state.adminGetOrders.find(data => data._id === id);

    console.log(choiceOrder)

    if (!choiceOrder) {
        return <div>
            loading...
        </div>
    }

    if (!state.adminGetOrders) {
        return <div>
            loading...
        </div>
    }


    return (
        <div>
            <div>
                <div>
                    <div>
                        {
                            choiceOrder.items[0].menuItem ? (
                                <img
                                    src={`${url}/upload/${choiceOrder.items[0].menuItem.file}`}
                                    alt="order"
                                    height='200px'
                                    width='200px'
                                />
                            ):('No file is associated with the selected item')
                        }
            
                    </div>
                    <p>Order ID: {choiceOrder._id}</p>
                    <p>Name: {choiceOrder.user.name}</p>
                    <p>Email: {choiceOrder.user.email}</p>
                    <p>
                        Phone Number: {choiceOrder.user.phoneNumber ? choiceOrder.user.phoneNumber : "None"}
                    </p>
                    <p>Quantity: {choiceOrder.quantity}</p>
                    <p>
                        Restaurant: {choiceOrder.restaurant ? choiceOrder.restaurant.name : "No restaurant"}
                    </p>
                    <p>Item: {choiceOrder.items[0].menuItem.name}</p>
                    <p>Price: &#8358;{choiceOrder.items[0].menuItem.price}</p>
                    <p>Order date: {choiceOrder.orderDate}</p>
                    <p>Pack: {choiceOrder.pack}</p>
                    <p>Payment: {choiceOrder.paymentStatus}</p>
                    <p>Mode of Payment: {choiceOrder.paymentMethod}</p>
                    <p>Order Status: {choiceOrder.status}</p>

                    <div>
                        <button onClick={() => confirmOrder(choiceOrder._id)}>Confirm Order</button>
                    </div>
                    <div>
                        <button onClick={() => confirmDelivery(choiceOrder._id)}>Confirm Order Delivery</button>
                    </div>
                </div>
            </div>
        </div>
    )
}