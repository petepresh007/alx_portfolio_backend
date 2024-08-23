import axios from "axios";
import {menu, url} from '../server';
import {useAppContext} from '../component/context';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';


export const Menu = () => {
    const {state, dispatch} = useAppContext();
    const [loading, setLoading] = useState(true);
    const go = useNavigate();


    useEffect(() => {
        async function getMenu() {
            try {
                const { data } = await axios.get(`${menu}/all`);
                //console.log(data)
                dispatch({ type: 'SET_MENU', payload: data });
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        getMenu()
    }, [dispatch]);

    if(!state.menu){
        return <div>
            loading...
        </div>
    }


    if (loading) {
        return <div>
            loading....
        </div>
    }


    return (
        <div className="menu-item-block">
            <h1>Available Menu</h1>
            <section className="menu">
                {
                    state.menu && state.menu.map(data => {
                        return (
                            <div
                                className="menu-center"
                                key={data._id}
                                onClick={() => {
                                    go(`/selected-menu/${data._id}`)
                                }}
                            >
                                <img src={`${url}/upload/${data.file}`} alt="" />
                                <p>{data.name}</p>
                                <button>Checkout</button>
                            </div>
                        )
                    })
                }
            </section>
        </div>
    )
}