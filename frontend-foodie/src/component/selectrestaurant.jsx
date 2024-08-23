import { Link, Outlet } from "react-router-dom";
import { useAppContext } from "../component/context";
import { restaurant } from "../server";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaMailBulk, FaMapPin, FaStore } from "react-icons/fa";
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import FoodieAnimation from '../component/foodieAnimation'
import '../styles/dropdown.css'


export const SelectedRestaurant = () => {
    const { state, dispatch } = useAppContext();
    const { id } = useParams();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getRestaurant() {
            try {
                const { data } = await axios.get(`${restaurant}`);
                dispatch({ type: 'SET_RESTAURANT', payload: data });
                //console.log(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        getRestaurant();
    }, [dispatch]);



    if (loading) {
        return (
                <FoodieAnimation/>
        )
    }

    const selectedRestaurant = state.restaurants && state.restaurants.find(data => data._id === id)
    //console.log(selectedRestaurant)

    return (
        <div className="res">
            <section className="rounded-lg px-4 pt-3 bg-gray-100 text-xs md:text-base flex flex-wrap justify-between font-semibold capitalize">
                <div className="flex gap-1">
                    <FaStore className="sm:translate-y-1"/>
                    <p>{selectedRestaurant.name}</p>
                </div>
                <div className="flex gap-1">
                    <FaMapPin className="sm:translate-y-1"/>
                    <p>{selectedRestaurant.address}</p>
                </div>

                <div className="contact sm:hidden relative flex gap-1">
                    <FaMailBulk/>
                    <p className=""> Contact &darr; </p>
                    <div className="dropdown hidden absolute -bottom-[80px] rounded-b-md p-2 pl-4 -right-4 bg-gray-100  flex flex-col ]">
                        <div className=" flex gap-1 text-sm border-b" >
                            <AiOutlineMail className="translate-y-1"/>
                            <p>{selectedRestaurant.email}</p>
                        </div>
                        <div className="flex gap-1 text-sm translate-y-2" >
                            <AiOutlinePhone className="translate-y-1 rotate-180"/>
                            <p>{selectedRestaurant.phone}</p>
                        </div>
                    </div>
                </div>

                <div className="sm:flex hidden gap-1" >
                    <AiOutlineMail className="sm:translate-y-1"/>
                    <p>{selectedRestaurant.email}</p>
                </div>
                <div className="sm:flex hidden gap-1" >
                    <AiOutlinePhone className="sm:translate-y-1 rotate-180"/>
                    <p>{selectedRestaurant.phone}</p>
                </div>


            </section>

            <div className=" relative z-0  justify-items-center my-8 ">
                {/* <AiOutlineSearch className="absolute z-0 right-2 top-2"/> */}
                <form action="" className="relative bg-white z-0  border border-black w-[80%] rounded-lg  max-w-[300px]">
                    <input
                        className="z-0 rounded-lg w-[inherit] px-2 outline-none bg-white border-none p-1"
                        type="text"
                        placeholder="Search for a menu item"
                    />
                </form>
            </div>

            <ul>
                <li><Link to={`/selected-res/${id}/`}>All</Link></li>
                <li><Link to={`/selected-res/${id}/rice`}>Rice</Link></li>
                <li><Link to={`/selected-res/${id}/beans`}>Beans</Link></li>
                <li><Link to={`/selected-res/${id}/swallow`}>Swallow</Link></li>
            </ul>
            <Outlet />
        </div>
    )
}