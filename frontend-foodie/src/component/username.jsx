import axios from "axios";
import {useAppContext} from "../component/context";
import { auth } from "../server";
import { useState, useEffect } from "react";


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
            loading...
        </div>
    }


    return (
        <div className="edit-username">
            <div className="edit-username-center">
                <h2>Current Username</h2>
                <p>Change the username asscociated with your account</p>
                <form onSubmit={editUserName}>
                    <div>
                        <input
                            type="text"
                            placeholder={`${state.user && state.user.user.username}`}
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                        />
                    </div>
                    <button>Edit Username</button>
                </form>
            </div>
        </div>
    )
}