import {useAppContext} from '../context';
import {Link, Outlet} from 'react-router-dom';
import {FaUser} from 'react-icons/fa';


export const Admin = () => {
    const {state, dispatch} = useAppContext();

    console.log(state.admin)

    if(!state.admin){
        return <div>
            loading...
        </div>
    }



    return (
        <div className="admin">
            <div className="admin-center">
                <section className="admin-message">
                    <div>
                        <h2>Hi, {state.admin && state.admin.user.username}</h2>
                    </div>
                    <span className='fa-user'><FaUser/></span>
                </section>

                <section className="admin-header">
                    <Link to='/admin/'>Home</Link>
                    <Link to='/admin/manageusers'>Manage Users</Link>
                    <Link>Manage Orders</Link>
                    <Link to='/admin/manageres'>Manage Restaurant</Link>
                    <Link>Manage Menu</Link>
                </section>
            </div>
            <Outlet/>
        </div>
    )
}