import {useEffect} from 'react';
import axios from 'axios';
import {menu} from '../../server';
import {useAppContext} from '../context';
import {AiOutlineEdit, AiOutlineDelete} from 'react-icons/ai';
import {useNavigate} from 'react-router-dom';


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
            loading...
        </div>
    }


    return (
        <div>
            <div>
                {
                    state.adminGetMenu && state.adminGetMenu.map((data)=>{
                        return <div key={data._id}>
                            <p>{data.name}</p>
                            <p>{data.price}</p>
                            {data.restaurant ? <p>{data.restaurant.name}</p>:''}
                            <AiOutlineDelete 
                                onClick={()=> del(data._id)}
                            />
                            <AiOutlineEdit
                                onClick={() => go(`/admin/managemenu/editmenu/${data._id}`)}
                            />
                        </div>
                    })
                }
            </div>
        </div>
    )
}