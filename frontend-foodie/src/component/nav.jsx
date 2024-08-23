import { Link, useNavigate } from "react-router-dom";
import { FaLocationArrow } from "react-icons/fa";
import { AiOutlineSearch, AiOutlineShoppingCart, AiOutlineUser } from "react-icons/ai";
import { useAppContext } from "./context";
import { useEffect, useState } from "react";
import axios from "axios";
import { auth, order, adminauth } from "../server";
import { FaSearch } from "react-icons/fa"

export const Nav = () => {
    const { state, dispatch } = useAppContext();
    const go = useNavigate();
    axios.defaults.withCredentials = true;


    //sticky effect
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);


        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


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


    useEffect(() => {
        async function getUser() {
            try {
                const { data } = await axios.get(`${adminauth}/stay-loggedin`, {
                    withCredentials: true
                });
                dispatch({ type: 'SET_ADMIN', payload: data });
            } catch (error) {
                console.log(error);
            }
        }
        getUser()
    }, [dispatch]);



    useEffect(() => {
        async function getCart() {
            try {
                const { data } = await axios.get(`${order}/my-orders-cart`, {
                    withCredentials: true
                });
                dispatch({ type: 'SET_CART', payload: data });
            } catch (error) {
                console.log(error)
            }
        }
        getCart()
    }, [dispatch]);

    //logout the admin
    async function logoutAdmin() {
        try {
            await axios.post(`${adminauth}/logout`);
            dispatch({type:'SET_ADMIN', payload: null});
            go('/loginadmin');
        } catch (error) {
            console.log(error)
        }
    }


    return (
    <header className=" mt-2 md:mt-4 lg:mt-6 sticky top-2 mb-4 ">
        <div className={`w-full flex justify-center items-center ${isSticky ? 'sticky' : ''}`}>
            {/* <div className="flex border-2 border-black ">
                <div className="flex">
                    <FaLocationArrow />
                    <p>Address </p>
                    <AiOutlineShoppingCart onClick={() => go('/cart')} />
                </div>
                <span className="cart-num">{state.cart.length ? state.cart.length : ''}</span>
            </div> */}
            <nav className="p-2 lg:px-4 rounded-2xl lg:rounded-3xl bg-white/40 shadow-lg">
                <ul 
                  className="flex gap-4 lg:gap-6 text-xs sm:text-sm md:text-base lg:text-lg text-shadow-sm font-medium text-[#FAF3E0] items-center "
                  style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'}}
                  >
                    <FaSearch className="self-center" onClick={() => go('/search')} />
                    <li className="md:hover:scale-[1.05] md:active:scale-[0.98] ease-in-out duration-100 "><Link to='/'>home</Link></li>
                    <li className="md:hover:scale-[1.05] md:active:scale-[0.98] ease-in-out duration-100 "><Link to='/orders'>order</Link></li>
                    <li className="md:hover:scale-[1.05] md:active:scale-[0.98] ease-in-out duration-100 "><Link to='/restaurant'>restaurants</Link></li>
                    <li className="md:hover:scale-[1.05] md:active:scale-[0.98] ease-in-out duration-100 "><Link to='/menu'>menu</Link></li>
                    <li>
                        {
                            !state.user ? <Link to='/login'>login</Link> : <AiOutlineUser
                                className="fill-white"
                                style={{ color: "gray", cursor: "pointer" }}
                                onClick={() => {
                                    go('/profile')
                                }}
                            />
                        }
                    </li>
                    {
                        state.admin ? (
                            <>
                                <Link to='/admin'>Admin</Link>
                                <Link to='/loginadmin' onClick={logoutAdmin}>logout</Link>
                            </>
                        ) : ""
                    }
                </ul>
            </nav>
        </div>
    </header>
    );
}