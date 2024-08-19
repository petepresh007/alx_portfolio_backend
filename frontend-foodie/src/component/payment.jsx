import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';
import {useAppContext} from "../component/context";
import {useParams} from "react-router-dom";
import {payment, order} from "../server";


export const Pay = () => {
    axios.defaults.withCredentials = true
    const {state, dispatch} = useAppContext();
    const {id} = useParams()
    const [ordersss, setOrder] = React.useState('')

   
    const exactOrder = state.cart && state.cart.find(data => data._id === id);
    console.log(exactOrder)

    // const handleCreateOrder = (data, actions) => {
    //     return axios.post('/create-payment', { orderId, amount })
    //         .then(response => {
    //             return response.data.orderID;
    //         });
    // };
    const handleCreateOrder = async () => {
        try {
            const { data } = await axios.post(`${payment}/create-payment`, {
                orderId: exactOrder._id,
                amount: exactOrder.totalAmount
            })
            return data.orderID;
        } catch (error) {
            console.log(error)
        }
    }

    const handleApprove = (data, actions) => {
        return axios.post(`${payment}/capture-payment`, { orderID: data.orderID })
            .then(response => {
                console.log('Payment Successful', response.data);
            })
            .catch(error => {
                console.error('Payment Error', error);
            });
    };

    return (
        <PayPalScriptProvider options={{ "client-id": 'AWP89tBwNOzNTiDNiATjgR61LyfTPD8Y35M-BG4sQEPP0mxxuQ74j6GfRz-WIXKfM9O5py-oko-BvDje' }}>
            <PayPalButtons
                createOrder={handleCreateOrder}
                // onApprove={handleApprove}
            />
        </PayPalScriptProvider>
    );
}