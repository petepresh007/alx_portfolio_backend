import { auth } from "../server";
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";


export const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const go = useNavigate()

    async function register(e) {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${auth}/register`, {
                name,
                email,
                phoneNumber,
                password
            });
            alert(`Registered successfully with username: ${data.user}`);
            go('/login');
        } catch (error) {
            alert(error.response.data.msg);
        }
    }


    return (
        <div className="flex grow-1 w-[100vw] h-[80vh] items-center  justify-center font-[Poppins]">
            <section className="flex flex-col gap-3 w-[80%] max-w-[350px] bg-orange-700 border-2 border-[#E0E0E0] px-4 py-6  rounded-md">
                <h1 className="text-xl text-center text-white text-2xl font-bold font-[Poppins]">Register</h1>
                <form 
                    className="flex flex-col gap-3 text-white "
                    action="" onSubmit={register}>
                    <div className="flex flex-col">
                        <label 
                            className="font-semibold text-base"
                            htmlFor="name">name</label>
                        <input
                            required
                            className="rounded-md p-1 px-2 text-base text-black font-bold"
                            id="name"
                            type="text"
                            placeholder="eg: Kofi"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label 
                            className="font-semibold text-base"
                            htmlFor="email">email</label>
                        <input
                            required
                            className="rounded-md p-1 px-2 text-base text-black font-bold"
                            id='email'
                            type="email"
                            placeholder="example@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label
                            className="font-semibold text-base"
                            htmlFor="tel">
                            phone number
                        </label>
                        <input
                            required
                            className="rounded-md p-1 px-2 text-base text-black font-bold"
                            id="tel"
                            type="tel"
                            placeholder="eg: +233-20-241-1777"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label
                            className="font-semibold text-base"
                            htmlFor="password">
                            password
                        </label>
                        <input
                            required
                            className="rounded-md p-1 px-2 text-base text-black font-bold"
                            id="password"
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                    className=" mt-3 active:scale-[.98] p-1 w-full bg-orange-800 font-semibold text-base text-white rounded-md border-2 border-gray-200"
                    aria-label="create account button">Create Account</button>
                    <div className="text-center">
                        <Link  className="text-xs md:text-sm text-center font-semibold hover:underline text-[#FFD54F]" to='/login' >
                            Already have an Account? Sign In
                        </Link>
                    </div>
                </form>
            </section>
        </div>
    )
}