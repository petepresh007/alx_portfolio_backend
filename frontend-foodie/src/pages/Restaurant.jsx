import { restaurant } from "../server";
import { useAppContext } from "../component/context";
import { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineShop } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import FoodieAnimation from "../component/foodieAnimation";
import { FaMapPin } from "react-icons/fa";

export const Restaurant = () => {
  const { state, dispatch } = useAppContext();
  const [loading, setLoading] = useState(true);
  const go = useNavigate();

  useEffect(() => {
    async function getRestaurant() {
      try {
        const { data } = await axios.get(`${restaurant}`);
        dispatch({ type: "SET_RESTAURANT", payload: data });
        //console.log(data)
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getRestaurant();
  }, [dispatch]);

  if (loading) {
    return (
      <div>
        <FoodieAnimation />
      </div>
    );
  }

  return (
    <div className="w-full">
      <section className="px-2 max-w-6xl mx-auto grid gap-6 lg:gap-14 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
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
                    <p className="text-xs sm:text-sm text-gray-600">{data.address}</p>
                  </div>
                </div>
              </div>
            );
          })}
      </section>
    </div>
  );
};
