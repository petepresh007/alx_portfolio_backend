import React, { useState } from 'react';
import axios from 'axios';
import { restaurant } from '../server';
import {useNavigate} from 'react-router-dom';


export const Search = () => {
    const [term, setTerm] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');
    const go = useNavigate();

    const handleSearch = async () => {
        try {
            const response = await axios.get(`${restaurant}/get/search`, {
                params: { term }
            });

            setResults(response.data);
            setError('');
        } catch (err) {
            setError('No restaurants or menu items found.');
            setResults([]);
        }
    };


    return (
        <div className='w-[100vw] overflow-x-none mt-8 px-2'>
            <div className="w-full flex flex-col gap-5 items-center">
                <h1 className='font-semibold border-b border-gray-500 md:text-xl '>Search for Restaurants and Menu items</h1>
                <form action="" onChange={handleSearch}>
                    <input
                        className='border border-black rounded-xl p-1 px-4 text-base'
                        aria-label='search for restaurants and menu items'
                        type="search"
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        placeholder="...banku"
                    />
                </form>

                {error && <p>{error}</p>}

                <div>
                    {results.map((restaurant) => (
                        <div
                            key={restaurant._id}
                            className='cursor-pointer ease-in-out duration-300 md:hover:scale-[1.07] active:scale-[.98] w-full text-xs rounded-md font-semibold p-4 pb-0 bg-indigo-200 sm:text-base lg:text-lg flex justify-between capitalize gap-5 my-2'
                            onClick={() => {
                                go(`/selected-res/${restaurant._id}`)
                            }}
                        >
                            <h3>{restaurant.name}</h3>
                            <p>{restaurant.address}</p>
                            <p>{restaurant.phone}</p>
                            <p>{restaurant.email}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};