import {useEffect} from 'react';
import axios from 'axios';
import {menu} from '../../server';
import {useAppContext} from '../context';
import {AiOutlineEdit, AiOutlineDelete} from 'react-icons/ai';
import {useNavigate} from 'react-router-dom';
import FoodieAnimation from '../foodieAnimation';


export const ManageMenu = () => {
    const {state, dispatch} = useAppContext();
    const go = useNavigate();


    useEffect(() => {
        async function getMenu() {
            try {
                const { data } = await axios.get(`${menu}/alladmin`);
                dispatch({ type: 'SET_ADMIN_MENU', payload: data });
            } catch (error) {
                console.log(error)
            }
        }
        getMenu()
    }, [dispatch]);


    async function del(id){
        try {
            const confirmation = confirm('Do you want to delete this menu?');
            if(confirmation){
                const { data } = await axios.delete(`${menu}/del/${id}`);
                dispatch({ type: 'SET_ADMIN_MENU', payload: data.data });
            }
        } catch (error) {
            alert(error.response.data.msg);
        }
    }
    
    if (!state.adminGetMenu){
        return <div>
           <FoodieAnimation/>
        </div>
    }


    return (
        <div className='w-full mt-6'>
            <div className='w-full space-y-5'>
                {
                    state.adminGetMenu && state.adminGetMenu.map((data)=>{
                        return (
                            <div 
                            className='hover:scale-[1.01] cursor-pointer duration-100 font-medium w-full grid grid-cols-4 gap-4 items-center shadow-md px-4 py-2'
                            key={data._id}
                          >
                            <p className='lowercase translate-y-2 lg:text-lg truncate'>{data.name}</p>
                            <p className='translate-y-2 lg:text-lg'>&#8358;{data.price}.00</p>
                            {data.restaurant ? (
                              <p className='translate-y-2 lg:text-lg truncate'>{data.restaurant.name}</p>
                            ) : (
                              <span></span>
                            )}
                            <div className='translate-y-2 flex justify-end gap-4'>
                              <AiOutlineDelete
                                className='hover:scale-[1.2] hover:fill-red-600 cursor-pointer'
                                onClick={(e) => {
                                  e.stopPropagation();
                                  del(data._id);
                                }}
                              />
                              <AiOutlineEdit
                                className='hover:scale-[1.2] hover:fill-green-800 cursor-pointer'
                                onClick={(e) => {
                                  e.stopPropagation();
                                  go(`/admin/managemenu/editmenu/${data._id}`);
                                }}
                              />
                            </div>
                          </div>
                        )
                    })
                }
            </div>
        </div>
    )
}