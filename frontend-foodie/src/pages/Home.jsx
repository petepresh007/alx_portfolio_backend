import { useEffect, useState } from "react";
import { useAppContext } from "../component/context";
import { menu, order, restaurant, url } from "../server";
import axios from "axios";
import { AiOutlineShop } from "react-icons/ai";
import { useNavigate } from "react-router-dom";


export const Home = () => {
    const { state, dispatch } = useAppContext();
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

    
    useEffect(() => {
        async function getMenu() {
            try {
                const { data } = await axios.get(`${menu}/all`);
                dispatch({ type: 'SET_MENU', payload: data });
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        getMenu()
    }, [dispatch]);


    useEffect(() => {
        async function getFav() {
            try {
                const { data } = await axios.get(`${order}/favorites`, {
                    withCredentials: true
                });
                console.log(data);
                dispatch({ type: 'SET_FAVORITE_ORDERS', payload: data });
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        getFav()
    }, [dispatch]);


    if (loading) {
        return <div>
            loading....
        </div>
    }


    return (
        <div className="home">
            <img src="/image/fd5.jpg" alt="img" />
            <div className="search-box">
                <h1>
                    F
                    <span className="food-search">
                        <img src="/image/fd4.png" alt="" />
                        <img src="/image/fd4.png" alt="" />
                    </span>
                    D
                </h1>
                <div className='search'>
                    <input
                        type="search"
                        placeholder='Food Drink ...'
                    />
                </div>
            </div>

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

            <>
                <h1 style={{textAlign:"center", color:"gray"}}>Menu</h1>
                <section className="menu">
                    {
                        state.menu && state.menu.map(data => {
                            return (
                                <div className="menu-center" key={data._id}>
                                    <img src={`${url}/upload/${data.file}`} alt="" />
                                    <p>{data.name}</p>
                                    <button>Checkout</button>
                                </div>
                            )
                        })
                    }
                </section>
            </>

            <>
                <h1 style={{ textAlign: "center", color: "gray" }}>Favourite</h1>
                <section className="menu">
                    {
                        state.favoriteOrders && state.favoriteOrders.map(data => {
                            return (
                                <div key={data._id}>
                                {
                                    data.items.map(data => {
                                        return <div className="menu-center" key={data.menuItem._id}>
                                            <img src={`${url}/upload/${data.menuItem.file}`} alt="" />
                                            <p>{data.menuItem.name}</p>
                                            <button>Checkout</button>
                                        </div>
                                    })
                                }
                                    {/* <div className="menu-center" key={data._id}>
                                         <img src={`${url}/upload/${data.file}`} alt="" />
                                        <p>{data.name}</p>
                                         <button>Checkout</button>
                                     </div> */}
                                </div>
                            )
                        })
                    }
                </section>
            </>
        </div>
    )
}