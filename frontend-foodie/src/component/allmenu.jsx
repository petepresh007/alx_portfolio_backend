import { useAppContext } from "../component/context";
import { restaurant, url } from "../server";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";


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
                loading...
            </div>
        )
    }

    const selectedRestaurant = state.restaurants && state.restaurants.find(data => data._id === id);
    console.log(selectedRestaurant)


    return (
        <div className="restaurant-menu">
            {
                selectedRestaurant.menu.length ? (
                    <>
                        {
                            selectedRestaurant.menu.map((data) => {
                                return (
                                    <div
                                        className="restaurant-menu-center"
                                        key={data._id}
                                        onClick={()=>{
                                            go(`/selected-res/${id}/order/${data._id}`)
                                        }}
                                    >
                                        <div className="details">
                                            <p>{data.name}</p>
                                            <small>{data.name}</small>
                                            <p>Price &#8358;{data.price}</p>
                                        </div>
                                        <div className="res-btn-img">
                                            <img src={`${url}/upload/${data.file}`} alt="" height='60px' width='60px' />
                                            <button>Add +</button>
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