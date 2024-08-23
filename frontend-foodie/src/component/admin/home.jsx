import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../context';
import { auth, restaurant } from '../../server';
import { AiOutlineShop, AiOutlineUser } from 'react-icons/ai';


export const AdminHome = () => {
    const { state, dispatch } = useAppContext();
    axios.defaults.withCredentials = true;


    useEffect(() => {
        async function getUsers() {
            try {
                const { data } = await axios.get(`${auth}/admin-get-user`);
                console.log(data)
                dispatch({ type: 'SET_ADMIN_USER', payload: data });
            } catch (error) {
                console.log(error)
            }
        }
        getUsers()
    }, [dispatch])

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


    if (!state.adminGetUser) {
        return <div>
            loading...
        </div>
    }


    if (!state.adminGetRestaurant){
        return <div>
            loading...
        </div>
    }


    return (
        <div className="admin-home">
            <h2>Available Details</h2>
            <div className="admin-home-center">
                <section className="admin-home-users">
                    <div>
                        <p>USERS</p>
                        <p>({state.adminGetUser && state.adminGetUser.length})</p>
                    </div>
                    <AiOutlineUser className='admin-home-icon' />
                </section>

                <section className="admin-home-users">
                    <div>
                        <p>RESTAURANTS</p>
                        <p>({state.adminGetRestaurant && state.adminGetRestaurant.length})</p>
                    </div>
                    <AiOutlineShop className='admin-home-icon' />
                </section>
            </div>
        </div>
    )
}