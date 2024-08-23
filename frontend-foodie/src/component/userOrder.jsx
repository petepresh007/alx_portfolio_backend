import { order } from '../server';
import { useEffect } from "react";
import axios from 'axios';
import { useAppContext } from "../component/context";


export const OrderDelivered = () => {
    axios.defaults.withCredentials = true;
    const { state, dispatch } = useAppContext()


    useEffect(() => {
        async function getDelivered() {
            try {
                const { data } = await axios.get(`${order}/my-orders-delivered`);
                dispatch({ type: 'SET_DELIVERED', payload: data });
            } catch (error) {
                console.log(error);
            }
        }
        getDelivered()
    }, []);

    
    if (!state.deliveredOrder) {
        return <div>
            loading...
        </div>
    }


    return (
        <div className='delivered'>
            <div className='delivered-center'>
                {
                    state.deliveredOrder && state.deliveredOrder.map((data)=> {
                        return <div key={data._id} className='delivered-center-details'>
                            <h3>id: {data._id}</h3>
                            <p>Menu: {data.items[0].menuItem.name}</p>
                            <p>Price: {data.totalAmount}</p>
                            <p>Payment Method: {data.paymentMethod}</p>
                            <p>Status: {data.status}</p>
                            <p>Address: {data.deliveryAddress}</p>
                            <p>Date: {data.orderDate}</p>
                        </div>
                    })
                }
            </div>
        </div>
    )
}