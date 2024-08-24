import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';
import { useAppContext } from "../component/context";
import { useParams } from "react-router-dom";
import { payment } from "../server";
import {useNavigate} from 'react-router-dom';
import FoodieAnimation from './foodieAnimation';


export const Pay = () => {
    axios.defaults.withCredentials = true
    const { state, dispatch } = useAppContext();
    const { id } = useParams();
    const go = useNavigate()


    const exactOrder = state.cart && state.cart.find(data => data._id === id);


    const handleCreateOrder = async () => {
        try {
            const { data } = await axios.post(`${payment}/create-payment`, {
                orderId: exactOrder._id,
                amount: exactOrder.totalAmount
            });
            return data.orderID;
        } catch (error) {
            console.log(error)
        }
    }


    const handleApprove = async (data, actions) => {
        try {
            const res = await axios.post(`${payment}/capture-payment`,
                {
                    orderID: data.orderID,
                    order: exactOrder._id
                });
            dispatch({ type: 'SET_CART', payload: res.data.data });
            alert(res.data.message)
            go('/orders')
        } catch (error) {
            alert(error.resonse.data.value);
        }
    }

    if (!exactOrder) {
        return <div>
            <FoodieAnimation/>
        </div>
    }


    return (
        <div className='w-[100%] min-h-screen items-center flex flex-col gap-4 justify-center'>
            <p className='text-lg sm:text-xl font-bold'>Choose Payment Option</p>
            <PayPalScriptProvider options={{ "client-id": 'AWP89tBwNOzNTiDNiATjgR61LyfTPD8Y35M-BG4sQEPP0mxxuQ74j6GfRz-WIXKfM9O5py-oko-BvDje' }}>
                <div className=' bg-gray-100 flex justify-center p-4 py-6'>
                    <PayPalButtons
                        className='w-[250px] sm:w-[400px]'
                        createOrder={handleCreateOrder}
                        onApprove={handleApprove}
                    />
                </div>
            </PayPalScriptProvider>
        </div>
    );
}