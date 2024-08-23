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
        <div className='search-item'>
            <div className="search-item-center">
                <form action="" onChange={handleSearch}>
                    <input
                        type="search"
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        placeholder="Restaurant Menu"
                    />
                </form>

                {error && <p>{error}</p>}

                <div>
                    {results.map((restaurant) => (
                        <div
                            key={restaurant._id}
                            className='search-item-details'
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