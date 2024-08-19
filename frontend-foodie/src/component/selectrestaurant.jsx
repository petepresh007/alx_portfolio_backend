import {Link, Outlet} from "react-router-dom";
import { useAppContext } from "../component/context";
import { restaurant } from "../server";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";


export const SelectedRestaurant = () => {
    const { state, dispatch } = useAppContext();
    const {id} = useParams();
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



    if(loading){
        return (
            <div>
                loading...
            </div>
        )
    }

    const selectedRestaurant = state.restaurants && state.restaurants.find(data => data._id === id)
    //console.log(selectedRestaurant)

    return (
        <div className="res">
            <section className="res-header">
                <h1>NAME: {selectedRestaurant.name}</h1>
                <h1>ADDRESS: {selectedRestaurant.address}</h1>
                <h1>EMAIL: {selectedRestaurant.email}</h1>
                <h1>PHONE: {selectedRestaurant.phone}</h1>
            </section>

            <ul>
                <li><Link to={`/selected-res/${id}/`}>All</Link></li>
                <li><Link to={`/selected-res/${id}/rice`}>Rice</Link></li>
                <li><Link to={`/selected-res/${id}/#`}>Beans</Link></li>
                <li><Link to={`/selected-res/${id}/#`}>Swallow</Link></li>
            </ul>
            <Outlet />
        </div>
    )
}