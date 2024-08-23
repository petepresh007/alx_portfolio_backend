import {restaurant} from '../server';
import {useAppContext} from '../component/context';
import {useEffect, useState} from 'react';
import axios from 'axios';
import {AiOutlineShop} from 'react-icons/ai';
import {useNavigate} from 'react-router-dom';


export const Restaurant = () => {
    const {state, dispatch} = useAppContext();
    const [loading, setLoading] = useState(true);
    const go = useNavigate();


    useEffect(() => {
        async function getRestaurant() {
            try {
                const { data } = await axios.get(`${restaurant}`);
                dispatch({ type: 'SET_RESTAURANT', payload: data });
                //console.log(data)
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        getRestaurant();
    }, [dispatch]);

    if(loading){
        return <div>
            loading...
        </div>
    }

    return(
        <div>
            <section className="restaurant">
                {
                    state.restaurants && state.restaurants.map((data) => {
                        return <div
                            className="restaurant-center"
                            key={data._id}
                            onClick={() => {
                                go(`/selected-res/${data._id}`)
                            }}
                        >
                            <AiOutlineShop className="shop" />
                            <div className="restuarant-details">
                                <h3>{data.name}</h3>
                                <small>{data.address}</small>
                            </div>
                        </div>
                    })
                }
            </section>
        </div>
    )
}