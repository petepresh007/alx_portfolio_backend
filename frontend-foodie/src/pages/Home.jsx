import { useEffect, useState } from "react";
import { useAppContext } from "../component/context";
import { menu, order, restaurant, url } from "../server";
import axios from "axios";
import { AiOutlineShop } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { FaMapPin } from "react-icons/fa";
import FoodieAnimation from "../component/foodieAnimation";

export const Home = () => {
  const { state, dispatch } = useAppContext();
  const [loading, setLoading] = useState(true);
  const go = useNavigate();

  useEffect(() => {
    async function getRestaurant() {
      try {
        const { data } = await axios.get(`${restaurant}`);
        dispatch({ type: "SET_RESTAURANT", payload: data });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getRestaurant();
  }, [dispatch]);

  useEffect(() => {
    async function getMenu() {
      try {
        const { data } = await axios.get(`${menu}/all`);
        //console.log(data)
        dispatch({ type: "SET_MENU", payload: data });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getMenu();
  }, [dispatch]);

  useEffect(() => {
    async function getFav() {
      try {
        const { data } = await axios.get(`${order}/favorites`, {
          withCredentials: true,
        });
        dispatch({ type: "SET_FAVORITE_ORDERS", payload: data });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getFav();
  }, [dispatch]);

  if (loading) {
    return <FoodieAnimation/>;
  }

  return (
    <div className="w-full px-2 lg:px-2  space-y-8 mt-6 pb-4">
      {/* <img src="/image/home-img.png" alt="img" /> */}

      <section className="w-full ">
        <div className="max-w-6xl mx-auto grid gap-6 lg:gap-14 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
          {state.restaurants &&
            state.restaurants.map((data) => {
              return (
                <div
                  className=" lg:hover:scale-[1.05] hover:shadow-xl shadow-gray-500 duration-300 cursor-pointer w-full max-w-[300px] border border-gray-300 rounded-md overflow-hidden"
                  key={data._id}
                  onClick={() => {
                    go(`/selected-res/${data._id}`);
                  }}
                >
                  <AiOutlineShop className="shop" />
                  <div className=" capitalize border-t-2 px-2 pt-2 lg:pt-4 font-semibold flex flex-col justify-between">
                    <h3 className="text-base lg:text-lg"> {data.name}</h3>
                    <div className="flex gap-1">
                      <FaMapPin />
                      <p className="text-sm lg:text-lg">{data.address}</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      <div className="flex flex-col gap-4 md:gap-6 pt-2  md:pt-[30px] lg:pt-[50px]">
        <h1
          className="font-[Ojuju] font-bold text-xl md:text-2xl lg:text-3xl"
          style={{ textAlign: "center", color: "gray" }}
        >
          Menu
        </h1>
        <section className="w-full font-baloo">
          <div className="max-w-6xl mx-auto grid gap-6 lg:gap-12 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
            {state.menu &&
              state.menu.map((data) => {
                return (
                  <div
                    className="lg:hover:scale-[1.05] hover:shadow-xl shadow-gray-700 duration-300 cursor-pointer w-full max-w-[300px] border border-gray-300 bg-orange-500 rounded-md overflow-hidden"
                    key={data._id}
                    onClick={() => {
                      go(`/selected-menu/${data._id}`);
                    }}
                  >
                    <img
                      className="w-full h-32 md:h-48 object-cover"
                      src={`${url}/upload/${data.file}`}
                      alt={data.name}
                    />
                    <div className="p-2 lg:pt-2 lg:pb-4 px-4">
                      <p className="text-center text-base lg:text-lg text-white font-semibold capitalize tracking-wider">
                        {data.name}
                      </p>
                      <button
                        aria-label="proceed to checkout"
                        className="font-[Roboto]  w-full bg-white text-orange-500 text-base font-bold rounded-md lg:hover:bg-white/90 lg:hover:text-green-800 transition duration-300"
                      >
                        Checkout
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-4 md:gap-6 pt-2  md:pt-[30px] lg:pt-[50px]">
        <h1
          className="font-[Ojuju] font-bold text-xl md:text-2xl lg:text-3xl"
          style={{ textAlign: "center", color: "gray" }}
        >
          Favourite
        </h1>
        <section className="w-full font-baloo">
          <div className="max-w-6xl mx-auto grid gap-6 lg:gap-12 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
            {state.favoriteOrders &&
              state.favoriteOrders.map((data) => {
                return (
                  <div
                    className="lg:hover:scale-[1.05] hover:shadow-xl shadow-gray-700 duration-300 cursor-pointer w-full max-w-[300px] border border-gray-300 bg-orange-500 rounded-md overflow-hidden"
                    key={data._id}
                  >
                    {data.items.map((data) => {
                      return (
                        <div className="lg:hover:scale-[1.05] hover:shadow-xl shadow-gray-700 duration-300 cursor-pointer w-full max-w-[300px] border border-gray-300 bg-green-600 rounded-md overflow-hidden" 
                            key={data.menuItem._id}>
                          <img
                            className="w-full h-32 md:h-48 object-cover"
                            src={`${url}/upload/${data.menuItem.file}`}
                            alt=""
                          />
                          <div className="p-2 lg:pt-2 lg:pb-4 px-4">
                            <p className="text-center text-base lg:text-lg text-white font-semibold capitalize tracking-wider">
                              {data.menuItem.name}
                            </p>
                            <button
                              aria-label="proceed to checkout"
                              className="font-[Roboto]  w-full bg-white text-gray-700 text-base font-bold rounded-md lg:hover:bg-white/90 lg:hover:text-green-800 transition duration-300"
                            >
                              Checkout
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {/* <div className="menu-center" key={data._id}>
                                                <img src={`${url}/upload/${data.file}`} alt="" />
                                                <p>{data.name}</p>
                                                <button>Checkout</button>
                                            </div> */}
                  </div>
                );
              })}
          </div>
        </section>
      </div>
    </div>
  );
};
