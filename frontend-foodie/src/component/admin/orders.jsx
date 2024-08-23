import axios from 'axios';
import { useEffect } from 'react';
import { useAppContext } from '../context';
import { order } from '../../server';
import { AiOutlineDelete } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';


export const OrderPage = () => {
    const { state, dispatch } = useAppContext();
    const go = useNavigate();

    //deleteorder
    async function del(id) {
        try {
            const confirmation = confirm('Do you want to delete this order?');
            if (confirmation) {
                const { data } = await axios.delete(`${order}/del/${id}`);
                dispatch({ type: 'SET_ADMIN_ORDER', payload: data.data });
            }
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


    return (
        <div>
            <h1>Users Orders</h1>
            <div>
                {
                    state.adminGetOrders && state.adminGetOrders.map((data) => {
                        return <div key={data._id}
                            className='order-check'
                        >
                            <p
                                onClick={() => go(`/admin/manageorders/order/${data._id}`)}
                                style={{cursor:'pointer'}}
                            >
                                id: {data._id}
                            </p>

                            <p>payment: {data.paymentMethod}</p>
                            <p>Payment status: {data.paymentStatus}</p>
                            <p>status: {data.status}</p>
                            <AiOutlineDelete onClick={() => del(data._id)} />
                        </div>
                    })
                }
            </div>
        </div>
    )
}