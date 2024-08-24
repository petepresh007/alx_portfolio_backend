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
            <div className="space-y-2 w-[80%] max-w-[300px] shadow-md p-4 border">
                <h1 className='text-center font-bold text-base md:text-lg'>Menu</h1>
                <form
                    className='block space-y-4' 
                    onSubmit={HandleMenu}
                >
                    <div className='flex flex-col'>
                        <label htmlFor='name' className='font-medium'>Dish</label>
                        <input
                            id='name'
                            className='shadow-sm px-2 py-1 border font-semibold'
                            type="text"
                            placeholder='name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className='flex flex-col'>
                        <label htmlFor='description' className='font-medium'>Dish Description</label>
                        <input
                            id='description'
                            className='shadow-sm px-2 py-1 border font-semibold'
                            type="text"
                            placeholder='description'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div className='flex flex-col'>
                        <label htmlFor='price' className='font-medium'>Price</label>
                        <input
                            id='price'
                            className='shadow-sm px-2 py-1 border font-semibold'
                            type="number"
                            placeholder='1000.00'
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />

                    </div>

                    <div className='flex flex-col'>
                        <label  htmlFor='meal-type' className='font-medium'>Meal type</label>
                        <select
                            id='meal-type'
                            className=''
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="">Select</option>
                            <option value="Rice">Rice</option>
                            <option value="Swallow">Swallow</option>
                            <option value="Beans">Beans</option>
                        </select>
                    </div>

                    <p className='font-semibold'>Choose display Image</p>    
                    <div className='handle-menu-file'>
                        <input
                            type="file"
                            id='file'
                            accept='image/*'
                            name='file'
                            onChange={(e) => setFile(e.target.files[0])}
                            required
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
                    <button className='w-full bg-blue-500 hover:bg-green-500 p-2 font-bold text-white active:scale-[.98]'>CREATE</button>
                </form>
            </div>
        </div>
    )
}