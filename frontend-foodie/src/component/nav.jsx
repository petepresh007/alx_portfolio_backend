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
    <header className="relative z-100  mt-2 md:mt-4 lg:mt-6 sticky top-2 mb-4 md:mb-8 lg:mb-12 ">
        <div className={`w-full flex justify-center items-center ${isSticky ? 'sticky' : ''}`}>
            {/* <div className="flex border-2 border-black ">
                <div className="flex">
                    <FaLocationArrow />
                    <p>Address </p>
                    <AiOutlineShoppingCart onClick={() => go('/cart')} />
                </div>
                <span className="cart-num">{state.cart.length ? state.cart.length : ''}</span>
            </div> */}
            <nav className="flex items-center gap-4 p-2 px-3 lg:px-4 rounded-2xl lg:rounded-3xl bg-white/80 shadow-lg">
              <Link to='/cart' className="flex relative">
                <AiOutlineShoppingCart className="w-6 cursor-pointer text-black"/>  
                <div className=" absolute w-2 h-2 -top-2 -right-2 rounded-full text-[10px]">
                  <p className="absolute top-0 right-1 p-1 py-0 font-semibold text-white bg-red-500 rounded-[inherit]">{state.cart.length ? state.cart.length : ''}</p>
                </div>
              </Link>
              
                <ul 
                  className="flex gap-4 lg:gap-6 text-xs sm:text-sm md:text-base lg:text-lg text-shadow-sm font-medium text-orange-500 items-center "
                  // style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'}}
                  >
                    <FaSearch className="self-center hidden md: flex" onClick={() => go('/search')} />
                    <li className="md:hover:scale-[1.05] md:active:scale-[0.98] ease-in-out duration-100 "><Link to='/'>home</Link></li>
                    <li className="md:hover:scale-[1.05] md:active:scale-[0.98] ease-in-out duration-100 "><Link to='/orders'>orders</Link></li>
                    <li className="md:hover:scale-[1.05] md:active:scale-[0.98] ease-in-out duration-100 "><Link to='/restaurant'>restaurants</Link></li>
                    <li className="md:hover:scale-[1.05] md:active:scale-[0.98] ease-in-out duration-100 "><Link to='/menu'>menu</Link></li>
                    <li>
                        {
                            !state.user ? <Link to='/login'>login</Link> : <AiOutlineUser
                                className="fill-black"
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