import {useState, useEffect} from "react";
import {useAppContext} from "../component/context";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {order} from '../server';
import { FaShoppingCart } from "react-icons/fa";


export const Cart = () => {
    const { state, dispatch } = useAppContext();
    const go = useNavigate();

    async function deleteOrde(id){
        try {
            const confirmation = confirm('Do you want to delete this order?');
            if(confirmation){
                const {data} = await axios.delete(`${order}/del-cart/${id}`);
                alert(data.msg)
                dispatch({ type: 'SET_CART', payload: data.data });
                //console.log(data);
            }
        } catch (error) {
            alert(error.response.data.msg);
            //console.log(error);
        }
    }

    
    return (
        <div>
            {
                state.cart ? (
                    <div className="w-full flex flex-col items-center mt-6 gap-4">
                        <div className="flex gap-2 border-b border-black"> 
                            <h1 className="text-bold text-2xl lg:text-3xl font-bold font-['Ojuju']">Cart</h1>
                            <FaShoppingCart size={20} className=" self-center -translate-y-1"/>
                        </div>
                        <div className="w-[90%] lg:p-4 flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-12">
                        {
                            state.cart.map((data)=>{
                                return <div key={data._id} className="bg-gray-100 p-4 rounded-md w-[fit-content] mb-4">
                                    <p className="text-base font-semibold uppercase"><span className="font-bold normal-case text-indigo-500">Delivery Address: </span>{data.deliveryAddress}</p>
                                    <p className="text-base font-semibold uppercase"><span className="font-bold normal-case text-indigo-500">Order date: </span>{data.orderDate}</p>
                                    <p className="text-base font-semibold uppercase"><span className="font-bold normal-case text-indigo-500">Pack Size: </span>{data.pack}</p>
                                    <p className="text-base font-semibold uppercase"><span className="font-bold normal-case text-indigo-500">Payment Method: </span>{data.paymentMethod}</p>
                                    <p className="text-base font-semibold uppercase"><span className="font-bold normal-case text-indigo-500">Payment Status: </span>{data.paymentStatus}</p>
                                    <p className="text-base font-semibold uppercase"><span className="font-bold normal-case text-indigo-500">Quantity: </span>{data.quantity}</p>
                                    <p className="text-base font-semibold uppercase"><span className="font-bold normal-case text-indigo-500">Restaurant: </span>{data.restaurant ? data.restaurant.name : 'No restuarant'}</p>
                                    <p className="text-base font-semibold uppercase"><span className="font-bold normal-case text-indigo-500">Order Status: </span>{data.status}</p>
                                    <p className="text-base font-semibold uppercase"><span className="font-bold normal-case text-indigo-500">Price: <span className="text-yellow-600">&#8358;</span></span>{data.totalAmount}</p>
                                    <p onClick={() => deleteOrde(data._id)} className="cursor-pointer lg:active:scale-[0.98] w-full text-center bg-red-600 text-base font-semibold uppercase"><span className="font-bold normal-case text-white ">Delete Order</span></p>
                                    <button 
                                        className="w-full text-center bg-green-600  lg:bg-black lg:hover:bg-green-600 lg:hover:scale-[1.05] duration-500 lg:active:scale-[0.98] text-xl text-white font-semibold" 
                                        aria-label="pay for items" 
                                        onClick={()=>go(`/payus/${data._id}`)}
                                    >
                                        PAY
                                    </button>
                                </div>
                            })
                        }
                        </div>
                    </div>
                ):('')
            }
        </div>
    )
}