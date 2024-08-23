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
            loading...
        </div>
    }

    //console.log(state.unreadNotification)

    return (
        <>
            <div className='profile'>
                <div className="profile-center">
                    <section className="profile-header">
                        <div>
                            <h1>Welcome {state.user && state.user.user.username}</h1>
                            <p>user id: {state.user && state.user.user.id}</p>
                        </div>
                        <button onClick={() => logout()}>Logout</button>
                    </section>

                    <section className="profile-body">
                        <div>
                            <span>
                                <AiOutlineBoxPlot />
                                <p>Orders</p>
                            </span>
                            <AiOutlineCaretRight onClick={() => go('/profile/order')} />
                        </div>

                        <div>
                            <span>
                                <div className='notification-inbox'>
                                    <AiOutlineInbox />
                                    {state.unreadNotification.length !== 0 ? <FaCircle className='notification-inbox-caret' /> : '' }
                                </div>
                                
                                <p>Inbox</p>
                            </span>
                            <AiOutlineCaretRight onClick={() => go('/profile/inbox')} />
                        </div>

                        <div>
                            <span>
                                <AiOutlineMessage />
                                <p>Reviews</p>
                            </span>
                            <AiOutlineCaretRight />
                        </div>

                        <div>
                            <span>
                                <AiOutlineHeart />
                                <p>Saved Items</p>
                            </span>
                            <AiOutlineCaretRight />
                        </div>

                        <div>
                            <span>
                                <AiOutlineSearch />
                                <p>Recently Searched</p>
                            </span>
                            <AiOutlineCaretRight />
                        </div>
                    </section>

                    <section className="profile-settings">
                        <h1>Account settings</h1>
                        <div>
                            <p>Address</p>
                            <AiOutlineCaretRight />
                        </div>

                        <div>
                            <p>Manage account</p>
                            <AiOutlineCaretRight onClick={() => go('/profile/manageaccount')} />
                        </div>
                    </section>
                </div>

            </div>

        </>
    )
}