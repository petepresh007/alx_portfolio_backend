import { useAppContext } from '../context';
import axios from 'axios';
import { useEffect } from 'react';
import { auth } from '../../server';
import { AiOutlineDelete } from 'react-icons/ai';


export const ManageUsers = () => {
    const { state, dispatch } = useAppContext();

    axios.defaults.withCredentials = true;


    useEffect(() => {
        async function getUsers() {
            try {
                const { data } = await axios.get(`${auth}/admin-get-user`);
                dispatch({ type: 'SET_ADMIN_USER', payload: data });
            } catch (error) {
                console.log(error)
            }
        }
        getUsers()
    }, [dispatch])


    async function delUser(id, username) {
        try {
            const confirmation = confirm(`Do you want to delete ${username}`);
            if (confirmation) {
                const { data } = await axios.delete(`${auth}/del-user-admin/${id}`);
                dispatch({ type: 'SET_ADMIN_USER', payload: data.data });
            }
        } catch (error) {
            alert(error.response.data.msg);
        }
    }

    
    if (!state.adminGetUser) {
        return <div>
            loading...
        </div>
    }


    return <div className='dash-user'>
        <div className='dash-user-center'>
            {
                state.adminGetUser && state.adminGetUser.map((data) => {
                    return <div className='dash-user-center-det' key={data._id}>
                        <p>{data._id}</p>
                        <p>{data.name}</p>
                        <p>{data.email}</p>
                        <p>{data.date}</p>
                        <AiOutlineDelete
                            className='dash-del'
                            onClick={()=> delUser(data._id, data.name)}
                        />
                    </div>
                })
            }
        </div>
    </div>
}