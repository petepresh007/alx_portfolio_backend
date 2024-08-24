import { useAppContext } from '../context';
import axios from 'axios';
import { useEffect } from 'react';
import { auth } from '../../server';
import { AiOutlineDelete } from 'react-icons/ai';
import FoodieAnimation from '../foodieAnimation';


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
            <FoodieAnimation/>
        </div>
    }


    return (
        <div className='w-full mt-4'>

            <div className='flex flex-col gap-4 md:gap-6'>
                {
                    state.adminGetUser && state.adminGetUser.map((data) => {
                        return (
                            <div className='cursor-auto flex justify-between shadow-md px-4' key={data._id}>
                                <p className='text-xs sm:text-sm lg:text-base font-medium translate-y-2'>{data._id}</p>
                                <p className='text-xs sm:text-sm lg:text-base font-medium translate-y-2'>{data.name}</p>
                                <p className='text-xs sm:text-sm lg:text-base font-medium translate-y-2'>{data.email}</p>
                                <p className='text-xs sm:text-sm lg:text-base font-medium translate-y-2'>{data.date}</p>
                                <AiOutlineDelete
                                    aria-label='delete user'
                                    className='dash-del hover:fill-red-500 fill-current'
                                    onClick={()=> delUser(data._id, data.name)}
                                />
                            </div>
                        );
                    })
                };
            </div>
        </div>
)
}