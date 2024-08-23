import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AiOutlineFile, AiOutlineUpload } from 'react-icons/ai';
import axios from 'axios';
import {menu} from '../../server';


export const CreateMenu = () => {
    const { id } = useParams();
    axios.defaults.withCredentials = true;


    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('')
    const [file, setFile] = useState('')

    async function HandleMenu(e){
        e.preventDefault();

        try {
            const menuItem = new FormData();

            menuItem.append('name', name);
            menuItem.append('description', description);
            menuItem.append('price', price);
            menuItem.append('category', category);
            menuItem.append('file', file);
            const { data } = await axios.post(`${menu}/create-menu/${id}`, menuItem);
            alert(data.msg)
        } catch (error) {
            alert(error.response.data.msg);
        }
    }


    return (
        <div className='create-menu'>
            <div className="create-restaurant-center">
                <h1>Menu</h1>
                <form onSubmit={HandleMenu}>
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
                            placeholder='description'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <input
                            type="number"
                            placeholder='price'
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />

                    </div>

                    <div>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Select</option>
                            <option value="Rice">Rice</option>
                            <option value="Swallow">Swallow</option>
                            <option value="Beans">Beans</option>
                        </select>
                    </div>

                    <div className='handle-menu-file'>
                        <input
                            type="file"
                            id='file'
                            accept='image/*'
                            name='file'
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                        {
                            file ? `${file.name}`
                                :
                                <span className='otila'><AiOutlineFile className='otil' /></span>
                        }
                        <label htmlFor="file" name='file' id='file'>
                            <AiOutlineUpload className='otil-btn' />
                        </label>
                    </div>
                    <button>CREATE</button>
                </form>
            </div>
        </div>
    )
}