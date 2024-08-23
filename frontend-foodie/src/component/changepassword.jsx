import { auth } from "../server";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useAppContext} from "../component/context";


export const ChangePassword = () => {
    const [password, setPassword] = useState('');
    const [newpassword, setnewpassword] = useState('');
    const [confirmpassword, setComfirmPassword] = useState('');
    axios.defaults.withCredentials = true;
    const {dispatch} = useAppContext();

    const go = useNavigate()

    async function passwordHandler(e) {
        e.preventDefault();
        try {
            const { data } = await axios.put(`${auth}/change-password`, {
                password,
                newpassword,
                confirmpassword
            });
            dispatch({ type: 'SET_USER', payload: null });
            alert(data.msg);
            go('/login');
            console.log(data);
        } catch (error) {
            alert(error.response.data.msg);
            //console.log(error)
        }
    }


    return (
        <div className="login">
            <section className="login-center">
                <h1>Change Password</h1>
                <form action="" onSubmit={passwordHandler}>
                    <div>
                        <input
                            type="password"
                            placeholder="current password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="new password"
                            value={newpassword}
                            onChange={(e) => setnewpassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="confirm password"
                            value={confirmpassword}
                            onChange={(e) => setComfirmPassword(e.target.value)}
                        />
                    </div>
                    
                    <button>Change</button>
                </form>
            </section>
        </div>
    )
}