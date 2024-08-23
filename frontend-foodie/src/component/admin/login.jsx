import { adminauth } from "../../server";
import { useState } from "react";
import axios from "axios";
import { useAppContext } from "../../component/context";
import { useNavigate } from "react-router-dom";


export const LoginAdmin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    axios.defaults.withCredentials = true
    const { state, dispatch } = useAppContext();
    const go = useNavigate();


    async function login(e) {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${adminauth}/login`, { email, password });
            dispatch({ type: 'SET_ADMIN', payload: data });
            alert(`Welcome ${data.user}`);
            go('/admin');
        } catch (error) {
            alert(error.response.data.msg);
        }
    }


    return (
        <div className="login">
            <section className="login-center">
                <h1>Admin</h1>
                <form action="" onSubmit={login}>
                    <div>
                        <input
                            type="email"
                            placeholder="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button>Login</button>
                </form>
            </section>
        </div>
    )
}