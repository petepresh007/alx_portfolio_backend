import { auth } from "../server";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


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
        <div className="login">
            <section className="login-center">
                <h1>Register</h1>
                <form action="" onSubmit={register}>
                    <div>
                        <input
                            type="text"
                            placeholder="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
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
                            type="text"
                            placeholder="phone number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
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
                    <div className="already-registered">
                        <div >
                            <small>Already have an Account?</small>
                            <small onClick={() => go('/login')}>Sign In</small>
                        </div>
                    </div>
                </form>
            </section>
        </div>
    )
}