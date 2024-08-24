import axios from "axios";
import { useAppContext } from "../component/context";
import { auth } from "../server";
import { useState, useEffect } from "react";


export const EditPhoneNumber = () => {
    const { state, dispatch } = useAppContext();
    const [phoneNumber, setPhoneNumber] = useState('');
    axios.defaults.withCredentials = true;

    async function editUserName(e) {
        e.preventDefault();
        try {
            const { data } = await axios.put(`${auth}/change-phone-num`, {
                phoneNumber
            });
            alert(data.msg);
            //console.log(data)
        } catch (error) {
            //console.log(error)
            alert(error.response.data.msg);
        }
    }

    if (!state.user) {
        return <div>
            loading...
        </div>
    }


    return (
        <div className="edit-username">
            <div className="edit-username-center">
                <h2 className="font-medium">Current Username</h2>
                <p  className="text-sm sm:text-base text-orange-600">Change the Phone number asscociated with your account</p>
                <form onSubmit={editUserName}>
                    <div>
                        <input
                            className="text-base sm:text-lg lg:text-xl font-medium"
                            aria-label="enter new phone number"
                            type="text"
                            placeholder='phone number'
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                    <button className="rounded-md hover:bg-green-600 active:scale-[.98] duration-100" aria-label="proceed to change phone number">Edit Phone Number</button>
                </form>
            </div>
        </div>
    )
}