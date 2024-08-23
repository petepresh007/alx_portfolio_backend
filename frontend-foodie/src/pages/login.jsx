import { auth } from "../server";
import { useState } from "react";
import axios from "axios";
import { useAppContext } from "../component/context";
import { useNavigate, Link } from "react-router-dom";


export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    axios.defaults.withCredentials = true
    const { state, dispatch } = useAppContext();
    const go = useNavigate();


    async function login(e) {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${auth}/login`, { email, password });
            dispatch({ type: 'SET_USER', payload: data });
            alert(`Welcome ${data.user}`);
            go('/');
        } catch (error) {
            alert(error.response.data.msg);
        }
    }


    return (
        <div className="flex grow-1 w-[100vw] h-[80vh] items-center  justify-center">
            <section className="w-[80%] max-w-[350px] bg-orange-700 border-2 border-[#E0E0E0] px-4 py-6  rounded-md space-y-4 ">
                <h1 className=" text-xl text-center text-white text-2xl font-bold font-[Poppins]">Sign In</h1>
                <form 
                    className="font-[Poppins] space-y-3 md:space-y-4 text-white "
                    action="" onSubmit={login}>
                    <div className="flex flex-col">
                        <label 
                        className="font-semibold text-base"
                        htmlFor="email">Email</label>
                        <input
                            className="rounded-md p-1 px-2 text-base text-black font-bold"
                            id="email"
                            type="email"
                            placeholder="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label 
                        className="font-semibold text-base"
                        htmlFor="password">Password</label>
                        <input
                            className="rounded-md p-1 px-2 text-base font-bold text-black"
                            id="password"
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button 
                    className=" p-1 w-full bg-orange-800 font-semibold text-base text-white rounded-md border-2 border-gray-200"
                    aria-label="login button">Login</button>
                    <div className="">
                        <div className="w-full text-center">
                           <Link className="text-xs md:text-sm text-center font-semibold hover:underline text-[#FFD54F]" to="/register">Don't have an account? Sign up</Link>
                        </div>
                        {/* <small>Forget Password</small> */}
                    </div>
                </form>
            </section>
        </div>
    )
}