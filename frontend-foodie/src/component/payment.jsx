import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';
import { useAppContext } from "../component/context";
import { useParams } from "react-router-dom";
import { payment } from "../server";
import {useNavigate} from 'react-router-dom';


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
            order loading....
        </div>
    }


    return (
        <PayPalScriptProvider options={{ "client-id": 'AWP89tBwNOzNTiDNiATjgR61LyfTPD8Y35M-BG4sQEPP0mxxuQ74j6GfRz-WIXKfM9O5py-oko-BvDje' }}>
            <PayPalButtons
                createOrder={handleCreateOrder}
                onApprove={handleApprove}
            />
        </PayPalScriptProvider>
    );
}