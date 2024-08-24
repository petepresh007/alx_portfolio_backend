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
        <div className="w-full flex flex-col items-center mt-[20vh]">
            <h1 className="text-xl md:text-2xl font-bold">Change Password</h1>
            <section className="shadow-md p-4 py-6 w-[65%] max-w-[400px] bg-orange-500 text-white">
                <form className="flex flex-col gap-3" action="" onSubmit={passwordHandler}>
                    <div className="flex flex-col">
                        <label htmlFor="currentPasswd" className="text-sm md:text-base lg:text-lg font-semibold">Current Password</label>
                        <input
                            id="currentPasswd"
                            aria-label="enter current password"
                            className="w-full font-medium text-black bg-gray-100 p-1 px-3 border-2 rounded-md "
                            type="password"
                            placeholder="current password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password" className="text-sm md:text-base lg:text-lg font-semibold">New Password</label>
                        <input
                            id="password"
                            aria-label="enter new password"
                            className="w-full font-medium text-black bg-gray-100 p-1 px-3 border-2 rounded-md "
                            type="password"
                            placeholder="new password"
                            value={newpassword}
                            onChange={(e) => setnewpassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="confirmPassword" className="text-sm md:text-base lg:text-lg font-semibold">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            aria-label="confirm new password"
                            className="w-full font-medium text-black bg-gray-100 p-1 px-3 border-2 rounded-md "
                            type="password"
                            placeholder="confirm new password"
                            value={confirmpassword}
                            onChange={(e) => setComfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button className="mt-2 py-2 bg-yellow-500 rounded-md hover:bg-red-500 active:scale-[.98] duration-100 ">Change</button>
                </form>
            </section>
        </div>
    )
}