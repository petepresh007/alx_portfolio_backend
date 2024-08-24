import axios from 'axios';
import { useAppContext } from '../component/context';
import { auth } from '../server';
import { useEffect } from 'react';
import {
    AiOutlineBoxPlot,
    AiOutlineCaretRight,
    AiOutlineHeart,
    AiOutlineInbox,
    AiOutlineMessage,
    AiOutlineSearch
} from 'react-icons/ai';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import { notification } from '../server';
import {FaCircle} from "react-icons/fa";
import FoodieAnimation from '../component/foodieAnimation';

export const Profile = () => {
    const { state, dispatch } = useAppContext();
    axios.defaults.withCredentials = true;
    const go = useNavigate();


    useEffect(() => {
        async function notReadNotification() {
            try {
                const { data } = await axios.get(`${notification}/not-read-yet`);
                dispatch({ type: 'SET_UNREAD', payload: data });
            } catch (error) {
                console.log(error)
            }
        }
        notReadNotification()
    }, [])



    useEffect(() => {
        async function getUser() {
            try {
                const { data } = await axios.get(`${auth}/stay-loggedin`, {
                    withCredentials: true
                });
                dispatch({ type: 'SET_USER', payload: data });
            } catch (error) {
                console.log(error);
            }
        }
        getUser()
    }, [dispatch]);


    async function logout() {
        try {
            const { data } = await axios.post(`${auth}/logout`);
            dispatch({ type: 'SET_USER', payload: null });
            dispatch({ type: 'SET_CART', payload: [] });
            go('/login')
        } catch (error) {
            console.log(error)
        }
    }

    if (!state.user) {
        <div>
            <FoodieAnimation/>
        </div>
    }

    //console.log(state.unreadNotification)

    return (
        <>
            <div className=''>
                <div className="profile-center pb-24">
                    <section className="text-white font-semibold px-4 py-2 bg-orange-500 w-full flex justify-between items-center">
                        <div>
                            <h1 className='text-lg sm:text-xl lg:text-3xl'>Welcome, {state.user && state.user.user.username}</h1>
                            <p className='text-xs sm:text-sm' >user id: {state.user && state.user.user.id}</p>
                        </div>
                        <button className='bg-red-500 rounded-md p-2 active:scale-[.98] self-end' onClick={() => logout()}>Logout</button>
                    </section>

                    <section className="w-[85%] mx-auto mt-4 space-y-3">
                        <Link to='/profile/order' className='lg:hover:scale-[1.04] duration-100 flex w-full items-center justify-between p-2 bg-white/20 shadow-md'>
                            <div className='flex translate-y-2 gap-2 font-medium text-base md:text-lg'>
                                <AiOutlineBoxPlot className='translate-y-1' />
                                <p>Orders</p>
                            </div>
                            <AiOutlineCaretRight/>
                        </Link>

                        <Link to='/profile/inbox' className='lg:hover:scale-[1.04] duration-100  flex w-full items-center justify-between p-2 bg-white/20 shadow-md'>
                            <div className='flex translate-y-2 gap-2 font-medium text-base md:text-lg'>
                                <div className='relative'>
                                    <AiOutlineInbox className='translate-y-1' />
                                    {state.unreadNotification.length !== 0 ? <FaCircle className='absolute w-2 -top-1 -right-1 fill-red-500' /> : '' }
                                </div>
                                
                                <p>Inbox</p>
                            </div>
                            <AiOutlineCaretRight />
                        </Link>

                        <Link to=''  className='lg:hover:scale-[1.04] duration-100 flex w-full items-center justify-between p-2 bg-white/20 shadow-md' >
                            <div className='flex translate-y-2 gap-2 font-medium text-base md:text-lg'>
                                <AiOutlineMessage className='translate-y-1' />
                                <p>Reviews</p>
                            </div>
                            <AiOutlineCaretRight />
                        </Link>

                        <Link to='' className='lg:hover:scale-[1.04] duration-100 flex w-full items-center justify-between p-2 bg-white/20 shadow-md'>
                            <div className='flex translate-y-2 gap-2 font-medium text-base md:text-lg'>
                                <AiOutlineHeart className='translate-y-1' />
                                <p>Saved Items</p>
                            </div>
                            <AiOutlineCaretRight />
                        </Link>

                        <Link to='' className='lg:hover:scale-[1.04] duration-100 flex w-full items-center justify-between p-2 bg-white/20 shadow-md'>
                            <div className='flex translate-y-2 gap-2 font-medium text-base md:text-lg'>
                                <AiOutlineSearch className='translate-y-1' />
                                <p>Recently Searched</p>
                            </div>
                            <AiOutlineCaretRight />
                        </Link>
                    </section>

                    <section className="w-[85%] mx-auto mt-4 lg:mt-8 space-y-3">
                        <h1 className='text-center text-xl md:text-2xl font-bold'>Account settings</h1>
                        <Link to=''  className='lg:hover:scale-[1.04] flex items-center duration-100 p-2 bg-white/20 shadow-md'>
                            <div className='w-full flex justify-between translate-y-2 font-medium text-base md:text-lg'>
                                <p>Address</p>
                                <AiOutlineCaretRight className='translate-y-1' />
                            </div>
                        </Link>

                        <Link to='/profile/manageaccount'  className='lg:hover:scale-[1.04] duration-100 flex w-full items-centerp-2 bg-white/20 shadow-md'>
                            <div className='w-full flex justify-between translate-y-2 font-medium text-base md:text-lg'>
                                <p>Manage account</p>
                                <AiOutlineCaretRight className='translate-y-1' />
                            </div>
                        </Link>
                    </section>
                </div>

            </div>

        </>
    )
}