import { Link, useNavigate } from "react-router-dom";
import { FaLocationArrow } from "react-icons/fa";
import { AiOutlineShoppingCart, AiOutlineUser } from "react-icons/ai";
import { useAppContext } from "./context";
import { useEffect } from "react";
import axios from "axios";
import { auth, order } from "../server";


export const Nav = () => {
    const { state, dispatch } = useAppContext();
    const go = useNavigate();


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


    return <header>
        <div className="header-stuff">
            <div className="location">
                <div className="cart-item">
                    <FaLocationArrow /> Address stays here <AiOutlineShoppingCart onClick={()=> go('/cart')}/>
                    <span className="cart-num">{state.cart.length}</span>
                </div>
            </div>
            <nav>
                <ul>
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/orders'>Order</Link></li>
                    <li><Link to='/restaurant'>Restaurant</Link></li>
                    <li><Link to='/menu'>Menu</Link></li>
                    <li>
                        {
                            state.user ? <Link>Account</Link> : <AiOutlineUser
                                style={{ color: "gray", cursor: "pointer" }}
                                onClick={() => {
                                    go('/login')
                                }}
                            />
                        }
                        {/* <AiOutlineUser
                            style={{ color: "gray", cursor: "pointer" }}
                            onClick={() => {
                                go('/login')
                            }}
                        /> */}
                    </li>
                </ul>
            </nav>
        </div>
    </header>
}