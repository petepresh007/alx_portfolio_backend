import { useState } from 'react';
import axios from 'axios';
import { restaurant } from '../../server';
import { useParams } from 'react-router-dom';


export const UpdateRestaurant = () => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    axios.defaults.withCredentials = true;

    const { id } = useParams();


    async function handleRestaurant(e) {
        e.preventDefault();
        try {
            const { data } = await axios.put(`${restaurant}/${id}`, {
                name,
                address,
                phone,
                email
            });
            alert(data.message);
            console.log(data.data);
        } catch (error) {
            //console.log(error);
            alert(error.response.data.msg);
        }
    }

    return (
        <div className="create-restaurant">
            <div className="create-restaurant-center">
                <h1>Restaurant</h1>
                <form onSubmit={handleRestaurant}>
                    <div>
                        <input
                            type="text"
                            placeholder='username'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder='address'
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder='phone number'
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button>UPDATE</button>
                </form>
            </div>
        </div>
    )
}