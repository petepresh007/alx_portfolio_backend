import axios from "axios";
import {useAppContext} from "../component/context";
import { auth } from "../server";
import { useState, useEffect } from "react";
import FoodieAnimation from "./foodieAnimation";


export const EditUsername = () => {
    const {state, dispatch} = useAppContext();
    const [name, setName] = useState('');
    axios.defaults.withCredentials = true;

    async function editUserName(e) {
        e.preventDefault();
        try {
            const { data } = await axios.put(`${auth}/change-username`, {
                name
            });
            alert(data.msg);
            dispatch({ type: 'SET_USER', payload: data.decode });
        } catch (error) {
            //console.log(error)
            alert(error.response.data.msg);
        }
    }

    if(!state.user){
        return <div>
            <FoodieAnimation/>
        </div>
    }


    return (
        <div className="edit-username">
            <div className="edit-username-center">
                <h2 className="font-medium">Current Username: <span className="pl-2 italic uppercase">{state.user && state.user.user.username}</span></h2>
                <p className="text-sm sm:text-base text-orange-600">Change the username asscociated with your account</p>
                <form onSubmit={editUserName}>
                    <div>
                        
                        <input
                            className="text-base sm:text-lg lg:text-xl font-medium"
                            aria-label="enter new username"
                            type="text"
                            placeholder={`${state.user && state.user.user.username}`}
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                        />
                    </div>
                    <button className="rounded-md hover:bg-green-600 active:scale-[.98] duration-100" aria-label="proceed to change username">Edit Username</button>
                </form>
            </div>
        </div>
    )
}