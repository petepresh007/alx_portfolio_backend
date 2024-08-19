import {useState, useEffect} from "react";
import {useAppContext} from "../component/context";
import {useNavigate} from "react-router-dom";


export const Cart = () => {
    const { state } = useAppContext();
    const go = useNavigate();


    return (
        <div>
            {
                state.cart ? (
                    <div className="cart">
                        <h1>Order</h1>
                        {
                            state.cart.map((data)=>{
                                return <div key={data._id} className="cart-center">
                                    <p>delivery address: {data.deliveryAddress}</p>
                                    <p>order date: {data.orderDate}</p>
                                    <p>pack: {data.pack}</p>
                                    <p>payment method: {data.paymentMethod}</p>
                                    <p>payment status: {data.paymentStatus}</p>
                                    <p>quantity: {data.quantity}</p>
                                    <p>restaurant: {data.restaurant.name}</p>
                                    <p>order status: {data.status}</p>
                                    <p>price: &#8358;{data.totalAmount}</p>
                                    <button onClick={()=>go(`/payus/${data._id}`)}>PAY</button>
                                </div>
                            })
                        }
                    </div>
                ):('')
            }
        </div>
    )
}