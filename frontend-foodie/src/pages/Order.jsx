import axios from "axios";
import { useState, useEffect } from "react";
import { order } from "../server";
import { useAppContext } from "../component/context";
import { AiOutlineDelete, AiOutlineHeart } from 'react-icons/ai';


export const Order = () => {
    const [error, setError] = useState(false);
    const { state, dispatch } = useAppContext();
    axios.defaults.withCredentials = true


    useEffect(() => {
        async function orderHistory() {
            try {
                const { data } = await axios.get(`${order}/my-orders`, {
                    withCredentials: true
                });
                dispatch({ type: 'SET_ORDERS', payload: data });
            } catch (error) {
                console.log(error);
            }
        }
        orderHistory();
    }, [dispatch]);


    //favourite orders
    async function getFavorite(id) {
        try {
            const { data } = await axios.put(`${order}/${id}/favorite`, {
                withCredentials: true
            });
            dispatch({ type: 'SET_ORDERS', payload: data });
        } catch (error) {
            console.log(error.response.data.msg);
        }
    }

    async function del(id){
        try {
            const conf = confirm('do you want to delete?');
            if(conf){
                const { data } = await axios.delete(`${order}/user-del/${id}`, {
                    withCredentials: true
                })
                alert(data.msg)
                dispatch({ type: 'SET_ORDERS', payload: data.data });
            }
            
        } catch (error) {
            console.log(error.response.data.msg);
        }
    }

    return (
        <div className="my-orders">
            <h1>Order History</h1>
            {
                state.myOrders ? ( 
                state.myOrders.map((data) => {
                    return <section className="my-orders-center" key={data._id}>
                        <p>{data._id}</p>
                        <p>{data.items[0].menuItem.name}</p>
                        <p>&#8358;{data.totalAmount}</p>
                        <AiOutlineDelete className="order-del" onClick={()=> del(data._id)} />
                        <span onClick={() => getFavorite(data._id)}>
                            {
                                data.favorite ? (
                                    <AiOutlineHeart className="order-heart" />
                                    ):(
                                        <AiOutlineHeart className="not-picked"/>
                                    )
                            }
                        </span>
                    </section> 
                
                })
            ):(
                <div>
                    Please to check your orders
                </div>
            )
            }
        </div>
    )
}