import { useEffect } from 'react';
import { notification } from '../server';
import axios from 'axios';
import { useAppContext } from '../component/context';


export const Message = () => {
    axios.defaults.withCredentials = true;
    const { state, dispatch } = useAppContext();

    useEffect(() => {
        async function notReadNotification() {
            try {
                const { data } = await axios.get(`${notification}/not-read-yet`);
                dispatch({ type: 'SET_UNREAD', payload: data });
            } catch (error) {
                console.log(error)
            }
        }
        notReadNotification()
    }, []);


    useEffect(() => {
        async function getNotification() {
            try {
                const { data } = await axios.get(`${notification}`);
                dispatch({ type: 'SET_NOTIFICATON', payload: data });
            } catch (error) {
                console.log(error);
            }
        }
        getNotification()
    }, []);

    async function readNotification(id) {
        try {
            const { data } = await axios.put(`${notification}/read-notification/${id}`);
            dispatch({ type: 'SET_NOTIFICATON', payload: data.read });
            dispatch({ type: 'SET_UNREAD', payload: data.notRead });
            //console.log(data)
        } catch (error) {
            alert(error.response.data.msg);
        }
    }

    if (!state.notification) {
        return <div>
            loading...
        </div>
    }

    if (!state.unreadNotification) {
        return <div>
            loading...
        </div>
    }

    return (
        <div className='notification'>
            <div className='notification-center'>
                {
                    state.notification && state.notification.map((data) => {
                        return <div
                            key={data._id}
                            className={`notification-center-det ${data.isRead ? 'read-message' : ''}`}
                        >
                            <div onClick={() => readNotification(data._id)} className='clickable'>
                                <div>
                                    <h3>Email: {data.user.email}</h3>
                                </div>
                                <p>Hi {data.user.name}</p>
                                <p>{data.message}</p>
                                <p>{data.type}</p>
                            </div>
                        </div>
                    })}
            </div>
        </div>
    )
}