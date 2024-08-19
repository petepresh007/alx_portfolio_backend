//needed modules for our context
import { useContext, useReducer, createContext } from 'react';


//initial states
const initialState = {
    user: null,
    isAuthenticated: false,
    orders: [],
    favoriteOrders: [],
    restaurants: [],
    menu: [],
    cart: [],
    myOrders: []
    // Add other state properties as needed
}

//actions
const ACTIONS = {
    SET_USER: 'SET_USER',
    LOGOUT: 'LOGOUT',
    ADD_ORDER: 'ADD_ORDER',
    SET_FAVORITE_ORDERS: 'SET_FAVORITE_ORDERS',
    SET_RESTAURANT: 'SET_RESTAURANT',
    SET_MENU: 'SET_MENU',
    SET_CART: 'SET_CART',
    SET_ORDERS: 'SET_ORDERS'
    // Add other actions as needed
};

const reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_USER:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
            };
        case ACTIONS.LOGOUT:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
            };
        case ACTIONS.ADD_ORDER:
            return {
                ...state,
                orders: [...state.orders, action.payload],
            };
        case ACTIONS.SET_FAVORITE_ORDERS:
            return {
                ...state,
                favoriteOrders: action.payload,
            };
        case ACTIONS.SET_RESTAURANT:
            return {
                ...state,
                restaurants: action.payload, // Update the entire list
            };
        case ACTIONS.SET_MENU:
            return {
                ...state,
                menu: action.payload, // Update the entire list
            };
        case ACTIONS.SET_CART:
            return {
                ...state,
                cart: action.payload, // Update the entire list
            };
        case ACTIONS.SET_ORDERS:
            return {
                ...state,
                myOrders: action.payload, // Update the entire list
            };
        default:
            return state;
    }
}

// Create Context
const AppContext = createContext();

// Context Provider
export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};

// Custom Hook to use the AppContext
export const useAppContext = () => {
    return useContext(AppContext);
};