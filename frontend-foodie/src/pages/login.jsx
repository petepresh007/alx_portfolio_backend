import {Link} from "react-router-dom";
import {auth} from "../server";
import {useState} from "react";
import axios from "axios";
import { useAppContext } from "../component/context";


export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    axios.defaults.withCredentials = true
    const { state, dispatch } = useAppContext();


    async function login(e){
        e.preventDefault();
        try {
            const {data} = await axios.post(`${auth}/login`, {email, password});
            dispatch({ type: 'SET_USER', payload: data });
            alert(`Welcome ${data.user}`);        
        } catch (error) {
            alert(error.response.data.msg);
        }
    }


    return (
        <div className="login">
            <section className="login-center">
                <h1>Login</h1>
                <form action="" onSubmit={login}>
                    <div>
                        <input
                            type="email"
                            placeholder="email"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                        />
                    </div>
                    <button>Login</button>
                    <div className="already-registered">
                        <div >
                            <small>Don't have an Account?</small>
                            <small>Sign In</small>
                        </div>
                        {/* <small>Forget Password</small> */}
                    </div>
                </form>
            </section>
        </div>
    )
}

