import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../context';
import { auth, menu, order, restaurant } from '../../server';
import { AiOutlineShop, AiOutlineUser } from 'react-icons/ai';
import {FaHamburger, FaShoppingCart} from 'react-icons/fa';
import FoodieAnimation from '../foodieAnimation';


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
            <FoodieAnimation/>
        </div>
    }

    if (!state.adminGetUser) {
        return <div>
           <FoodieAnimation/>
        </div>
    }


    if (!state.adminGetRestaurant){
        return <div>
            <FoodieAnimation/>
        </div>
    }

    if (!state.adminGetMenu) {
        return <div>
           <FoodieAnimation/>
        </div>
    }


    return (
        <div className="admin-home">
            <h2 className='text-xl md:text-2xl font-bold'>Insights</h2>
            <div className="w-full grid grid-cols-4 gap-4 ">
                <section className="bg-blue-500 py-4">
                    <div className='flex font-bold gap-3 justify-center text-white text-3xl'>
                        <p>{state.adminGetUser && state.adminGetUser.length}</p>
                        <p>USERS</p>
                    </div>
                    <AiOutlineUser className='admin-home-icon' />
                </section>

                <section className="bg-orange-500 py-4">
                    <div className='flex font-bold gap-3 justify-center text-white text-3xl'>
                        <p>{state.adminGetRestaurant && state.adminGetRestaurant.length}</p>
                        <p>RESTAURANTS</p>
                    </div>
                    <AiOutlineShop className='admin-home-icon' />
                </section>

                <section className="bg-indigo-500 py-4">
                    <div className='flex font-bold gap-3 justify-center text-white text-3xl'>
                        <p>{state.adminGetMenu && state.adminGetMenu.length}</p>
                        <p>MENU ITEMS</p>
                    </div>
                    <FaHamburger className='admin-home-icon' />
                </section>

                <section className="bg-green-500 py-4">
                    <div  className='flex font-bold gap-3 justify-center text-white text-3xl'>
                        <p>{state.adminGetOrders && state.adminGetOrders.length}</p>
                        <p>ORDERS</p>
                    </div>
                    <FaShoppingCart className='admin-home-icon' />
                </section>
            </div>
        </div>
    )
}