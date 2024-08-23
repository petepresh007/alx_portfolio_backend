import { useAppContext } from "../component/context";
import { FaLock, FaUser } from 'react-icons/fa';
import { AiOutlineCaretRight } from 'react-icons/ai';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth } from '../server';

export const ManageAccount = () => {
    const { state } = useAppContext();
    const [showPassword, setShowPassword] = useState(false);
    const [showUsername, setShowUsername] = useState(false);
    axios.defaults.withCredentials = true
    const go = useNavigate()
    const {dispatch} = useAppContext();

    
    const toggleShowUsername = () => setShowUsername(previous => !previous);
    const toggleShowPassword = () => setShowPassword(previous => !previous);

    if (!state.user) {
        return <div >
            loading...
        </div>
    }
    
    async function delAccount(){
        try {
            const confirmation = confirm('Do you want to delete your account??');
            if(confirmation){
                const { data } = await axios.delete(`${auth}/user-delete-account`);
                console.log(data)
                dispatch({type:'SET_USER', payload: null});
                go('/register');
            }
        } catch (error) {
            console.log(error);
        }
    }


    return <div className="manage-account">
        <div className="manage-acount-center">
            <h2>Hello {state.user && state.user.user.username}</h2>
            <div>
                <div className="manage-user">
                    <FaUser
                        className="user-icon"
                    />
                    <p>Profile Details</p>
                    <AiOutlineCaretRight
                        className={`user-caret ${showUsername ? 'ninety-deg' : ''}`}
                        onClick={() => toggleShowUsername()}
                    />
                </div>
                <div >
                    <p
                        className={`username ${showUsername ? 'show-details' : ''}`}
                        onClick={() => go('/profile/editusername')}
                    >
                        Username
                    </p>
                    <p className={`username ${showUsername ? 'show-details' : ''}`}
                        onClick={() => go('/profile/editphonenumber')}
                    >
                        Change Phone Number
                    </p>
                </div>

            </div>

            <div>
                <div className="manage-security">
                    <FaLock
                        className="user-icon"
                    />
                    <p>Security settings</p>
                    <AiOutlineCaretRight
                        className={`user-caret ${showPassword ? 'ninety-deg' : ''}`}
                        onClick={() => toggleShowPassword()}
                        
                    />
                </div>

                <div >
                    <p
                        className={`password ${showPassword ? 'show-details' : ''}`}
                        onClick={() => go('/profile/changepassword')}
                    >
                        Change Password
                    </p>

                    <p
                        className={`password ${showPassword ? 'show-details' : ''}`}
                        onClick={() => delAccount()}
                    >
                        Delete Account
                    </p>
                </div>
            </div>

        </div>
    </div>
}