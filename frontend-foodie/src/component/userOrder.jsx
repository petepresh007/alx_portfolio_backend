import { order } from '../server';
import { useEffect } from "react";
import axios from 'axios';
import { useAppContext } from "../component/context";
import FoodieAnimation from './foodieAnimation';


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
            <FoodieAnimation/>
        </div>
    }


    return (
        <div className='w-full flex justify-center'>
            <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6 gap-y-4 md:gap-y-8 '>
                {
                    state.deliveredOrder && state.deliveredOrder.map((data)=> {
                        return <div key={data._id} className='font-semibold bg-gray-100 p-4 capitalize shadow-md md:shadow-lg '>
                            <h3>id: <span className='pl-2 uppercase font-medium'>{data._id}</span></h3>
                            <p>Menu: <span className='pl-2 uppercase font-medium'>{data.items[0].menuItem.name}</span></p>
                            <p>Price: <span className='pl-2 uppercase font-medium'>&#8358;{data.totalAmount}.00</span></p>
                            <p>Payment Method: <span className='pl-2 uppercase font-medium'>{data.paymentMethod}</span></p>
                            <p>Status: <span className='pl-2 uppercase font-medium'>{data.status}</span></p>
                            <p>Address: <span className='pl-2 uppercase font-medium'>{data.deliveryAddress}</span></p>
                            <p>Date: <span className='pl-2 uppercase font-medium'>{data.orderDate}</span></p>
                        </div>
                    })
                }
            </div>
        </div>
    )
}