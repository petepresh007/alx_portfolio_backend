import { useAppContext } from "../component/context";
import { restaurant, url } from "../server";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaShoppingCart } from "react-icons/fa";
import FoodieAnimation from "./foodieAnimation";


export const AllMenuRes = () => {

    const { state, dispatch } = useAppContext();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const go = useNavigate();


    useEffect(() => {
        async function getRestaurant() {
            try {
                const { data } = await axios.get(`${restaurant}`);
                dispatch({ type: 'SET_RESTAURANT', payload: data });
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
            <div>
              <FoodieAnimation/>
            </div>
        )
    }

    const selectedRestaurant = state.restaurants && state.restaurants.find(data => data._id === id);
    console.log(selectedRestaurant)


    return (
        <div className=" w-full flex flex-col mx-auto gap-4">
            {
                selectedRestaurant.menu.length ? (
                    <>
                        {
                            selectedRestaurant.menu.map((data) => {
                                return (
                                    <div
                                        className="bg-[#F4EAE1] self-center w-[95%] max-w-[800px] p-2 sm:p-4 rounded-md flex justify-between"
                                        key={data._id}
                                        onClick={()=>{
                                            go(`/selected-res/${id}/order/${data._id}`)
                                        }}
                                    >
                                        <div className="font-semibold capitalize content-center">
                                            <p>{data.name}</p>
                                            <small>{data.name}</small>
                                            <p>Price <span className="text-yellow-700">&#8358;</span>{data.price}</p>
                                        </div>
                                        <div className=" w-[100px] sm:w-[150px] max-w-[300px] flex flex-col rounded-sm gap-1 bg-gray-400 text-black sm:p-2">
                                            <img className="w-full rounded-inherit" src={`${url}/upload/${data.file}`} alt="food-item" />
                                            <button className="text-xs sm:text-base w-full bg-white font-medium flex justify-center pt-1 gap-1">
                                                <span>Add to Cart</span> 
                                                <div className="translate-y-1">
                                                    <FaShoppingCart/>
                                                </div>
                                            </button>
                                        </div>

                                    </div>
                                )
                            })
                        }
                    </>
                )
                    : ("No menu yet")
            }
        </div>
    )
}