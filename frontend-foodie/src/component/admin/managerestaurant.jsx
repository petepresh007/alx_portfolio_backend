import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { restaurant } from '../../server';
import { useEffect } from "react";
import { useAppContext } from '../context';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';


export const ManageRestaurants = () => {
    const go = useNavigate();
    axios.defaults.withCredentials = true;
    const { state, dispatch } = useAppContext();


    useEffect(() => {
        async function getRes() {
            try {
                const { data } = await axios.get(`${restaurant}/admin-get`);
                dispatch({ type: 'SET_ADMIN_RES', payload: data });
            } catch (error) {
                console.log(error)
            }
        }
        getRes()
    }, [dispatch])

    async function DeleteRestaurant(id, username) {
        try {
            const confirmation = confirm(`do you want to delete ${username}??`);
            if (confirmation) {
                const { data } = await axios.delete(`${restaurant}/${id}`);
                alert(data.message);
                dispatch({ type: 'SET_ADMIN_RES', payload: data.data });
            }
        } catch (error) {
            //console.log(error);
            alert(error.response.data.msg);
        }
    }


    if (!state.adminGetRestaurant) {
        return <div>
            loading...
        </div>
    }


    return (
        <div className="dash-res">
            <div className="dash-res-center">
                <section className="create-restaurant-main">
                    <h1 onClick={() => {
                        go('/admin/manageres/createres');
                    }}>Create</h1>
                    <span>{new Date().toLocaleDateString()}</span>
                </section>

                <section className="dash-res-center-det">
                    {
                        state.adminGetRestaurant && state.adminGetRestaurant.map(data => {
                            return <div key={data._id} className='dash-res-things'>
                                <p
                                    onClick={() => {
                                        go(`/admin/manageres/createresmenu/${data._id}`)
                                    }}
                                >{data.name}</p>
                                <p>{data.email}</p>
                                <p>{data.address}</p>
                                <AiOutlineDelete
                                    className='res-icon'
                                    onClick={() => {
                                        DeleteRestaurant(data._id, data.name);
                                    }}
                                />
                                <AiOutlineEdit
                                    className='res-icon'
                                    onClick={() => {
                                        go(`/admin/manageres/updateres/${data._id}`)
                                    }} />
                            </div>
                        })
                    }
                </section>
            </div>
        </div>
    )
}
