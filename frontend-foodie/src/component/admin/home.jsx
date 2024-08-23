import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../context';
import { auth, menu, order, restaurant } from '../../server';
import { AiOutlineShop, AiOutlineUser } from 'react-icons/ai';
import {FaHamburger, FaShoppingCart} from 'react-icons/fa';


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


    useEffect(() => {
        async function getMenu() {
            try {
                const { data } = await axios.get(`${menu}/alladmin`);
                dispatch({ type: 'SET_ADMIN_MENU', payload: data });
            } catch (error) {
                console.log(error)
            }
        }
        getMenu()
    }, [dispatch]);

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


    if (!state.adminGetOrders) {
        return <div>
            loading...
        </div>
    }

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

    if (!state.adminGetMenu) {
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

                <section className="admin-home-users">
                    <div>
                        <p>MENU</p>
                        <p>({state.adminGetMenu && state.adminGetMenu.length})</p>
                    </div>
                    <FaHamburger className='admin-home-icon' />
                </section>

                <section className="admin-home-users">
                    <div>
                        <p>ORDERS</p>
                        <p>({state.adminGetOrders && state.adminGetOrders.length})</p>
                    </div>
                    <FaShoppingCart className='admin-home-icon' />
                </section>
            </div>
        </div>
    )
}